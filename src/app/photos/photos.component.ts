import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ApiHelperService } from '../services/api-helper.service';
import { GlobalStateService } from '../services/global-state.service';
import { faSpinner, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit, OnDestroy {
  faSpinner = faSpinner;
  faSave = faSave;
  faTrash = faTrash;
  albumId!: number;
  albumCaption!: string;
  photos: any[] = [];
  captions: string[] = [];
  showDeleteConfirmationModals: boolean[] = [];
  dragAndDropPhotoCaption = '';
  selectedIndex = -1;
  apiAddress: string = '';
  token: string = '';
  isAuthorized: boolean = false;
  opacity$ = new BehaviorSubject<number>(0);
  private subscriptions: Subscription = new Subscription();
  photoRows: any[][] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiHelperService,
    private globalStateService: GlobalStateService,

  ) {
    this.apiAddress = apiService.getApiAddress();
    this.token = this.globalStateService.tokenSubject.value ? this.globalStateService.tokenSubject.value : '';
    this.isAuthorized = this.globalStateService.isAuthorizedSubject.value ? this.globalStateService.isAuthorizedSubject.value : false;
  }

  imageUrl(photo: any): string {
    return `${this.apiAddress}/RandomHandler/Index/PhotoID=${photo.photoID}/Size=M`;
  }

  ngOnInit(): void {
    this.albumId = +this.route.snapshot.paramMap.get('albumId')!;
    this.albumCaption = this.route.snapshot.paramMap.get('albumCaption')!;
    this.subscriptions.add(
      this.globalStateService.loading.subscribe(loading => {
        this.opacity$.next(loading ? 1 : 0);
      })
    );
    this.fetchPhotos();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  fetchPhotos(): void {
    this.globalStateService.setLoading(true);
    this.apiService.getHelper<any[]>(`${this.apiAddress}/api/photos/album/${this.albumId}`)
      .subscribe(response => {
        this.photos = response;
        this.captions = response.map(p => p.caption);
        this.showDeleteConfirmationModals = response.map(() => false);
        if (this.globalStateService.isAuthorizedSubject.value) {
          this.photos = this.addDefaultImage(this.photos);
        }

        this.photoRows = this.calculatePhotoRows();
        this.globalStateService.setLoading(false);
      });
  }

  calculatePhotoRows(): any[][] {
    const rows: any[][] = [];
    for (let i = 0; i < this.photos.length; i += 5) {
      rows.push(this.photos.slice(i, i + 5));
    }
    return rows;
  }


  addDefaultImage(responsePhotos: any[]): any[] {
    const emptyPhoto = { photoID: 0, albumID: `${this.albumId}`, caption: '' };
    return [...responsePhotos, emptyPhoto];
  }

  handleCaptionChange(newCaption: string, index: number): void {
    if (this.captions[index] !== newCaption) {
      this.captions[index] = newCaption;
    }
  }

  handlePhotoAdded(): void {
    this.fetchPhotos();
    this.dragAndDropPhotoCaption = '';
  }

  handleDragAndDropPhotoCaptionChanged(newCaption: string): void {
    if (this.dragAndDropPhotoCaption !== newCaption) {
      this.dragAndDropPhotoCaption = newCaption;
    }
  }

  handleDelete(index: number): void {
    this.globalStateService.setLoading(true);
    this.apiService.deleteHelper(`${this.apiAddress}/api/photos/delete/${this.photos[index].photoID}`, this.token)
      .subscribe(() => {
        this.fetchPhotos();
      });
  }

  toggleDelete(index: number): void {
    this.showDeleteConfirmationModals[index] = !this.showDeleteConfirmationModals[index];
  }

  handleUpdate(index: number): void {
    this.selectedIndex = index;
    this.globalStateService.setLoading(true);
    this.apiService.putHelper(`${this.apiAddress}/api/photos/update/${this.photos[index].photoID}`, this.captions[index] , this.token)
      .subscribe(() => {
        this.globalStateService.setLoading(false);
      });
  }
}
