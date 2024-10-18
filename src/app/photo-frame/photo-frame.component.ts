import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-photo-frame',
  templateUrl: './photo-frame.component.html',
  styleUrls: ['./photo-frame.component.scss']
})
export class PhotoFrameComponent {
  @Input() hidden: boolean = false;
  @Input() defaultImage: boolean = false;
}
