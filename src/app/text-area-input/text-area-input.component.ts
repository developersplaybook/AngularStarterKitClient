import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-text-area-input',
  templateUrl: './text-area-input.component.html',
  styleUrls: ['./text-area-input.component.scss']
})
export class TextAreaInputComponent {
  @Input() text: string = '';         // Equivalent to the React 'text' prop
  @Input() placeholder: string = '';  // Equivalent to the React 'placeholder' prop
  @Input() hasError: boolean = false; // Equivalent to the React 'hasError' prop

  @Output() textChanged = new EventEmitter<string>(); // Equivalent to the React 'onTextChanged' prop

  // Method to handle text input changes
  updateValue(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    this.text = input.value;
    this.textChanged.emit(this.text); // Emit the changed text
  }
}
