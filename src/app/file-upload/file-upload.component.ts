import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ApiHelperService } from '../services/api-helper.service';
import { GlobalStateService } from '../services/global-state.service';
import { faSpinner, faSave, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons'; 

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  faSpinner = faSpinner;
  faSave = faSave;
  faTrash = faTrash;
  faTimes = faTimes;
  image = { preview: '', raw: null as File | null };
  dropState = { dropDepth: 0, inDropZone: false, fileList: [] as File[] };
  apiAddress:string = '';
  token:string = '';

  @Input() albumId!: number;
  @Input() caption!: string;
  @Output() onPhotoAdded = new EventEmitter<any>();

  constructor(
    private sanitizer: DomSanitizer,
    private apiService: ApiHelperService,
    private globalStateService: GlobalStateService) {
    this.apiAddress = this.apiService.getApiAddress();
    this.token = this.globalStateService.tokenSubject.value ? this.globalStateService.tokenSubject.value  : '';
  }

  get showSave(): boolean {
    const value = this.caption;
    return value !== null && value.trim() !== '';
  }

  get opacity(): number {
    return this.globalStateService.loadingSubject.getValue() ? 1 : 0;
  }

  get sanitizedImagePreview(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.image.preview);
  }

  handleChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.updateImage(input.files);
    }
  }

  handleUpload(event: Event): void {
    event.preventDefault();
    this.globalStateService.setLoading(true);

    const formData = new FormData();
    if (this.image.raw) {
      formData.append('Image', this.image.raw);
    }
    formData.append('AlbumId', this.albumId.toString());
    formData.append('Caption', this.caption);

    this.apiService.postImageHelper(`${this.apiAddress}/api/photos/add/`, formData, this.token)
      .subscribe({
        next: response => {
          this.onPhotoAdded.emit(response);
          this.image = { preview: '', raw: null };
        },
        error: error => {
          alert('Error connecting to server: ' + error.message);
        },
        complete: () => {
          this.globalStateService.setLoading(false);
        }
      });
  }

  handleCancel(event: Event): void {
    event.preventDefault();
    this.image = { preview: '', raw: null };
  }

  handleDragEnter(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dropState.dropDepth += 1;
  }

  handleDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dropState.dropDepth -= 1;
    if (this.dropState.dropDepth === 0) {
      this.dropState.inDropZone = false;
    }
  }

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer!.dropEffect = 'copy';
    this.dropState.inDropZone = true;
  }

  handleDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const files = Array.from(event.dataTransfer!.files);
    const fileList = this.createFileList(files);
    if (fileList.length > 0) {
      this.updateImage(fileList);
      const existingFileNames = new Set(this.dropState.fileList.map(f => f.name));
      const newFiles = files.filter(file => !existingFileNames.has(file.name));
      this.dropState.fileList.push(...newFiles);
      this.dropState.dropDepth = 0;
      this.dropState.inDropZone = false;
    }
  }

  private createFileList(files: File[]): FileList {
    const dataTransfer = new DataTransfer();
    files.forEach(file => dataTransfer.items.add(file));
    return dataTransfer.files;
  }

  private updateImage(files: FileList): void {
    if (files.length > 0) {
      const file = files[0];
      this.image = {
        preview: URL.createObjectURL(file),
        raw: file
      };
    }
  }
}
