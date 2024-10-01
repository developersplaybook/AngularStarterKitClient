import { ChangeDetectionStrategy, Component, OnInit  } from '@angular/core';
import { GlobalStateService } from '../services/global-state.service';
import { ApiHelperService } from '../services/api-helper.service';
import { Observable, finalize } from 'rxjs';
import { map } from 'rxjs/operators';
import { faSpinner, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';     

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlbumsComponent implements OnInit {
  faSpinner = faSpinner;
  faSave = faSave;
  faTrash = faTrash;
  albums: any[] = [];
  albumRows: any[][] = [];
  opacity$: Observable<number>;
  apiAddress: string = '';
  token: string = '';
  isAuthorized:boolean = false;
  errorStates: { [key: number]: boolean } = {};

  constructor(
    private globalStateService: GlobalStateService,
    private apiService: ApiHelperService,
  ) {
    this.opacity$ = this.globalStateService.loading.pipe(map(loading => loading ? 1 : 0));
    this.apiAddress = this.apiService.getApiAddress();
    this.isAuthorized = this.globalStateService.isAuthorizedSubject.value;
    this.token = this.globalStateService.tokenSubject.value ? this.globalStateService.tokenSubject.value: '';
  }

  ngOnInit(): void {
    this.getAlbumsWithPhotoCount();
  }


  getAlbumsWithPhotoCount(): void {
    this.globalStateService.setLoading(true);
  
    this.apiService.getHelper<any[]>(`${this.apiAddress}/api/albums`)
      .subscribe({
        next: (response) => {
          this.albums = response;
          if (this.isAuthorized && this.noEmptyAlbumsExists(this.albums)) {
            const album = { albumID: 0, photoCount: 0, caption: '', isPublic: true };
            this.albums.push(album);
          }
          this.initializeErrorStates(this.albums);
          this.albumRows = this.getAlbumRows();
        },
        error: (error) => {
          console.error('Failed to fetch albums:', error);
        },
        complete: () => {
          this.globalStateService.setLoading(false);
        }
      });
  }

  initializeErrorStates = (albumsArray:any[]):void => {
    this.errorStates = {};
    albumsArray.forEach(album => {
      this.errorStates[album.albumID] = false;
    });
  };
  

  noEmptyAlbumsExists(albums: any[]): boolean {
    return albums.every(album => album.photoCount > 0);
  }

  getAlbumRows(): any[][] {
    const rows = [];
    for (let i = 0; i < this.albums.length; i += 2) {
      rows.push(this.albums.slice(i, i + 2));
    }
    return rows;
  }

  handleUpdate(albumId: number, newCaption: string): void {
    this.globalStateService.setLoading(true);
    this.apiService.putHelper(
      `${this.apiAddress}/api/albums/update/${albumId}`, newCaption, this.token!)
      .pipe(
        finalize(() => this.globalStateService.setLoading(false)) // This will be called after next, error, or complete
      )
      .subscribe({
        next: () => this.getAlbumsWithPhotoCount(),
        error: (error) => { 
          console.error('Update failed:', error); 
          this.errorStates[albumId] = true;
        }
    });
  }
  

  handleDelete(albumId: number): void {
    this.globalStateService.setLoading(true);
    this.apiService.deleteHelper(`${this.apiAddress}/api/albums/delete/${albumId}`, this.token!
    ).subscribe({
      next: () => this.getAlbumsWithPhotoCount(),
      error: (error) => console.error('Delete failed:', error),
      complete: () => this.globalStateService.setLoading(false)
    });
  }

  handleAdd(albumId: number, newCaption: string): void {
    this.globalStateService.setLoading(true);
    this.apiService.postHelper(`${this.apiAddress}/api/albums/add`, newCaption, this.token)
      .pipe(
        finalize(() => this.globalStateService.setLoading(false)) // This will be called after next, error, or complete
      )
      .subscribe({
        next: () => this.getAlbumsWithPhotoCount(),
        error: (error) => { 
          console.error('Add failed:', error); 
          this.errorStates[albumId] = true;
        }
      });
  }

  handleCaptionChange = (albumId: number) => {
    this.errorStates[albumId] = false;
  };
}
