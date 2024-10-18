import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GlobalStateService } from '../services/global-state.service';
import { ApiHelperService } from '../services/api-helper.service'; 
import { faSpinner, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';   

@Component({
  selector: 'app-album-frame',
  templateUrl: './album-frame.component.html',
  styleUrls: ['./album-frame.component.scss']
})
export class AlbumFrameComponent {
  faSpinner = faSpinner;
  faSave = faSave;
  faTrash = faTrash;
  @Input() albumId!: number;
  @Input() caption!: string;
  @Input() photoCount!: number;
  @Input() itemCount!: number;
  @Output() delete = new EventEmitter<number>();
  @Output() update = new EventEmitter<{ albumId: number, caption: string }>();
  @Output() add = new EventEmitter<{ albumId: number, caption: string }>(); 
  @Input() hasError!: boolean;
  @Output() onCaptionChange = new EventEmitter<string>();
  apiAddress: string = ''; 
  isAuthorized: boolean =false;; 

  constructor(
    private apiService: ApiHelperService,     
    private globalStateService: GlobalStateService,) 
  {
    this.apiAddress = this.apiService.getApiAddress();
    this.isAuthorized = this.globalStateService.isAuthorizedSubject.value;
  }

  get albumImageUrl(): string {
    return `${this.apiAddress}/RandomHandler/Index/AlbumID=${this.albumId}/Size=M?timestamp=${Date.now()}`;
  }

  get isAddNewAlbum(): boolean {
    return this.albumId === 0;
  }

  get isUpdateOldAlbum(): boolean {
    return this.isAuthorized && !this.isAddNewAlbum;
  }

  get isDisabledForAddAndUpdate(): boolean {
    return (this.caption || '').trim() === '';
  }

  get isDisabledForDelete(): boolean {
    return this.photoCount > 0;
  }

  onDelete(albumId: number) {
    if (this.delete) {
      this.delete.emit(albumId);
    }
  }

  onUpdate(newCaption: string) {
    if (this.update) {
      this.update.emit({ albumId: this.albumId, caption: newCaption });
    }
  }

  handleUpdateAlbum = () => {
    this.onUpdate(this.caption); // Use the prop function to handle add
  };

  onAdd(cap: string) {
    if (this.add) {
      this.add.emit({ albumId: this.albumId, caption: cap });
    }
  }

  handleAddAlbum = () => {
    this.onAdd(this.caption); // Use the prop function to handle add
  };

  handleCaptionChangeInternal = (value:string) => {
    this.caption = value;
    this.onCaptionChange.emit(value); // Call the function passed as a prop to reset the error state
  };
}
