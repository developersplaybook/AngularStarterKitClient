import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHelperService } from '../services/api-helper.service'; 
import { lastValueFrom } from 'rxjs';
import { Photo } from '../../models/photo.model';

@Component({
  selector: 'app-details',
  templateUrl: './photo-details.component.html',
  styleUrls: ['./photo-details.component.scss']
})
export class PhotoDetailsComponent implements OnInit {
  photos: Photo[] = [];
  photoId: number = 0; 
  albumCaption: string = ''; 
  apiAddress: string = ''; 
  captionToShow: string = ''; 
  first: number = 0; 
  last: number = 0; 
  photoNumber: number = 0; 
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
        await this.getAllPhotosInAlbumByPhotoId(randomPhotoId);
      } catch (error) {
        alert('Could not contact server ' + error);
      }
    } else {
      await this.getAllPhotosInAlbumByPhotoId(photoId);
    }
  };

  async getAllPhotosInAlbumByPhotoId(id: number): Promise<void> {
    this.photoId = id;
    try {
      const photo:Photo = await lastValueFrom(this.apiService.getHelper<Photo>(`${this.apiAddress}/api/photodetails/${id}`));
      this.albumCaption = photo.albumCaption || 'No caption available';
      const photoList:Photo[] = await lastValueFrom(this.apiService.getHelper<Photo[]>(`${this.apiAddress}/api/photos/album/${photo.albumID}`));
      this.photos = photoList;
      this.updateClickList();
    } catch (error) {
      alert('Could not contact server ' + JSON.stringify(error));
    }
  }
  

  getPhotoNumber = (pid:number):number => {
    const photo = this.photos.find(p => p.photoID === pid);
    return photo ? this.photos.indexOf(photo) + 1 : 0;
  };

  updateClickList(): void {
    this.photoNumber = this.getPhotoNumber(this.photoId);
    const index = this.photoNumber > 0 ? this.photoNumber - 1 : 0;
    const photo = this.photos[index];
    this.captionToShow = this.photos[this.photoNumber > 0 ? this.photoNumber - 1 : 0].caption;

    this.first = this.photos[0]?.photoID || 0;
    this.last = this.photos[this.photos.length - 1]?.photoID || 0;

    this.prev = this.photoNumber > 1 ? this.photos[this.photoNumber - 2]?.photoID || this.first : this.first;
    this.next = this.photoNumber < this.photos.length ? this.photos[this.photoNumber]?.photoID || this.last : this.last;
  }

  getDetailsRoute(id: number): string {
    return `/photodetails/${id}`;
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
