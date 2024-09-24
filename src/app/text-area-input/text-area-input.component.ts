import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-text-area-input',
  templateUrl: './text-area-input.component.html',
  styleUrls: ['./text-area-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: TextAreaInputComponent,
    multi: true
  }]
})
export class TextAreaInputComponent implements ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() preText: string = '';
  @Input() value: string = '';  
  
  @Output() textChanged = new EventEmitter<string>();

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Implement if you need to disable the textarea
  }

  updateValue(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    this.value = input.value;
    this.onChange(this.value);
    this.textChanged.emit(this.value);
  }
}
