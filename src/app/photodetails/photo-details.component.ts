import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHelperService } from '../services/api-helper.service'; 
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './photo-details.component.html',
  styleUrls: ['./photo-details.component.scss']
})
export class PhotoDetailsComponent implements OnInit {
  photos: any[] = [];
  photoId: number = 0; 
  albumId: number = 0; 
  albumCaption: string = ''; 
  apiAddress: string = ''; 
  captionToShow: string = ''; 
  first: number = 0; 
  last: number = 0; 
  indexPlusOne: number = 0; 
  prev: number = 0; 
  next: number = 0; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiHelperService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.photoId = +params['photoId'] || 0;
      this.albumId = +params['albumId'] || 0;
      this.albumCaption = params['albumCaption'] || '';
      this.apiAddress = this.apiService.getApiAddress();

      this.fetchPhotos(this.photoId);
    });
  }

  get photoUrl(): string {
    return `${this.apiAddress}/RandomHandler/Index/PhotoID=${this.photoId}/Size=L`;
  }

  get downloadUrl(): string {
    return `${this.apiAddress}/RandomHandler/Download/${this.photoId}/Size=L`;
  }


  async fetchPhotos(photoId:number): Promise<void> {
    if (photoId === 0) {
      try {
        const randomPhotoId = await lastValueFrom(this.apiService.getHelper<number>(`${this.apiAddress}/api/photodetails/savedphotoid`));
        this.photoId = randomPhotoId;
        await this.getAllPhotosFromAlbumWithSavedPhotoId();
      } catch (error) {
        alert('Could not contact server ' + error);
      }
    } else {
      try {
        const response:any[] = await lastValueFrom(this.apiService.getHelper<[]>(`${this.apiAddress}/api/photodetails/${this.albumId}`));
        if (response.length) {
          const { albumID } = response[0];
          this.albumId = albumID;
  
          const albums:any[] = await lastValueFrom(this.apiService.getHelper<[]>(`${this.apiAddress}/api/albums`));
          const album = albums.find(({ albumID: id }) => id === albumID);
          this.albumCaption = album?.caption || 'No caption available';
        }

        this.photos = response;
        this.updateClickList();
      } catch (error) {
        alert('Could not contact server ' + error);
      }
    }
  };

  async getAllPhotosFromAlbumWithSavedPhotoId(): Promise<void> {
    try { 
      const response = await lastValueFrom(this.apiService.getHelper<any[]>(`${this.apiAddress}/api/photodetails/0`));
      if (response.length) {
        const { albumID } = response[0];
        this.albumId = albumID;

        const albums:any[] = await lastValueFrom(this.apiService.getHelper<[]>(`${this.apiAddress}/api/albums`));
        const album = albums.find(({ albumID: id }) => id === albumID);
        this.albumCaption = album?.caption || 'No caption available';
      }

      this.photos = response;
      this.updateClickList();
    } catch (error) {
      alert('Could not contact server ' + JSON.stringify(error));
    }
  }
  

  async fetchPhotosByAlbumId(albumId: number): Promise<void> {
    try {
      const response = await lastValueFrom(this.apiService.getHelper<any[]>(`${this.apiAddress}/api/photodetails/${albumId}`));
      this.photos = response;
      this.updateClickList();
    } catch (error) {
      alert('Could not contact server ' + JSON.stringify(error));
    }
  }

  getIndexPlusOne = (pid:number):number => {
    const photo = this.photos.find(p => p.photoID === pid);
    return photo ? this.photos.indexOf(photo) + 1 : 0;
  };

  updateClickList(): void {
    this.indexPlusOne = this.getIndexPlusOne(this.photoId);
    const index = this.indexPlusOne > 0 ? this.indexPlusOne - 1 : 0;
    const photo = this.photos[index];
    this.captionToShow = this.photos[this.indexPlusOne > 0 ? this.indexPlusOne - 1 : 0].caption;

    this.first = this.photos[0]?.photoID || 0;
    this.last = this.photos[this.photos.length - 1]?.photoID || 0;

    this.prev = this.indexPlusOne > 1 ? this.photos[this.indexPlusOne - 2]?.photoID || this.first : this.first;
    this.next = this.indexPlusOne < this.photos.length ? this.photos[this.indexPlusOne]?.photoID || this.last : this.last;
  }

  getDetailsRoute(id: number): string {
    return `/photodetails/${id}/${this.albumId}`;
  }

  setDetailsRoute(event: Event, id: number): void {
    event.preventDefault();
    if (typeof id === 'number' && !isNaN(id)) {
      this.router.navigateByUrl(this.getDetailsRoute(id));
    } else {
      console.error('Invalid photoID:', id);
    }
  }
}
