import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss']
})
export class DeleteConfirmationComponent implements OnChanges {
  @Input() showModal: boolean = false;
  @Input() message: string = '';
  @Output() confirmModal = new EventEmitter<void>();
  @Output() hideModal = new EventEmitter<void>();

  localShowModal: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showModal']) {
      this.localShowModal = changes['showModal'].currentValue;
      if (!this.localShowModal) {
        this.hideModal.emit();
      }
    }
  }

  handleClose(): void {
    this.localShowModal = false;
    this.hideModal.emit();
  }
}
