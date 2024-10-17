import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GlobalStateService } from '../services/global-state.service';
import { ApiHelperService } from '../services/api-helper.service';
import { Observable, finalize } from 'rxjs';
import { map } from 'rxjs/operators';
import { faSpinner, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Album } from '../../models/album.model';

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
  albums: Album[] = [];
  albumRows: Album[][] = [];
  opacity$: Observable<number>;
  apiAddress: string = '';
  token: string = '';
  isAuthorized: boolean = false;
  errorStates: { [key: number]: boolean } = {};

  constructor(
    private globalStateService: GlobalStateService,
    private apiService: ApiHelperService,
  ) {
    this.opacity$ = this.globalStateService.loading.pipe(map(loading => loading ? 1 : 0));
    this.apiAddress = this.apiService.getApiAddress();
    this.isAuthorized = this.globalStateService.isAuthorizedSubject.value;
    this.token = this.globalStateService.tokenSubject.value ? this.globalStateService.tokenSubject.value : '';
  }

  ngOnInit(): void {
    this.getAlbumsWithPhotoCount();
    this.initializeErrorStates(this.albums);
  }

  initializeErrorStates = (albumsArray: Album[]): void => {
    this.errorStates = {};
    albumsArray.forEach(album => {
      this.errorStates[album.albumID] = false;
    });
  };

  noEmptyAlbumsExists(albums: Album[]): boolean {
    return albums.every(album => album.photoCount > 0);
  }

  getAlbumsWithPhotoCount(): void {
    this.globalStateService.setLoading(true);
    this.apiService.getHelper<Album[]>(`${this.apiAddress}/api/albums`)
      .subscribe({
        next: (response) => {
          this.albums = response;
          if (this.isAuthorized && this.noEmptyAlbumsExists(this.albums)) {
            const emptyAlbum:Album = { albumID: 0, photoCount: 0, caption: '', isPublic: true };
            this.albums.push(emptyAlbum);
          }

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

  getAlbumRows(): Album[][] { 
    const rows: Album[][] = []; 
    for (let i = 0; i < this.albums.length; i += 2) {
      rows.push(this.albums.slice(i, i + 2));
    }
    return rows;
  }

  handleDelete(albumId: number): void {
    this.globalStateService.setLoading(true);
    this.apiService.deleteHelper<void>(`${this.apiAddress}/api/albums/delete/${albumId}`, this.token!
    ).subscribe({
      next: () => {
        const updatedAlbums = this.albums.filter(album => album.albumID !== albumId)
        this.albums = updatedAlbums;
        if (this.isAuthorized && this.noEmptyAlbumsExists(updatedAlbums)) {
          const emptyAlbum:Album = { albumID: 0, photoCount: 0, caption: '', isPublic: true };
          this.albums.push(emptyAlbum);
          this.albumRows = this.getAlbumRows();
        }

        delete this.errorStates[albumId];
        this.globalStateService.setLoading(true);
      },
      error: (error) => console.error('Delete failed:', error),
      complete: () => this.globalStateService.setLoading(false)
    });
  }

  handleUpdate(albumId: number, newCaption: string): void {
    this.globalStateService.setLoading(true);
    this.apiService.putHelper<string, string>(
      `${this.apiAddress}/api/albums/update/${albumId}`, newCaption, this.token!)
      .pipe(
        finalize(() => this.globalStateService.setLoading(false)) // This will be called after next, error, or complete
      )
      .subscribe({
        next: () => this.albums = this.albums.map(album => album.albumID === albumId ? { ...album, caption: newCaption } : album),
        error: (error) => {
          console.error('Update failed:', error);
          this.errorStates[albumId] = true;
        }
      });
  }


  handleAdd(albumId: number, newCaption: string): void {
    this.globalStateService.setLoading(true);
    this.apiService.postHelper<Album, string>(`${this.apiAddress}/api/albums/add`, newCaption, this.token)
      .pipe(
        finalize(() => this.globalStateService.setLoading(false)) // Ensures loading is reset in any case
      )
      .subscribe({
        next: (newAlbum: Album) => {
          // Update the albums list, keeping only albums with ID not equal to 0 and appending the new one
          this.albums = [...this.albums.filter(album => album.albumID !== 0), newAlbum];
          this.errorStates = { ...this.errorStates, [newAlbum.albumID]: false };
          this.albumRows = this.getAlbumRows();
        },
        error: (error) => {
          console.error('Failed to add album:', error);

          // Set error state for the albumId
          this.errorStates = { ...this.errorStates, [albumId]: true };
        }
      });
  }


  handleCaptionChange = (albumId: number) => {
    this.errorStates[albumId] = false;
  };
}
