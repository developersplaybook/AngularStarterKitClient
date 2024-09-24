import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-angular-svg-icon',
  templateUrl: './angular-svg-icon.component.html',
  styleUrls: ['./angular-svg-icon.component.scss'],
  animations: [
    trigger('rotateAnimation', [
      transition(':enter', [
        style({ transform: 'rotateX(0) rotateY(0) rotateZ(0)' }),
        animate('10s', style({ transform: 'rotateX(360deg) rotateY(360deg) rotateZ(360deg)' }))
      ]),
      transition(':leave', [
        style({ transform: 'rotateX(360deg) rotateY(360deg) rotateZ(360deg)' }),
        animate('1s', style({ transform: 'rotateX(0) rotateY(0) rotateZ(0)' }))
      ])
    ])
  ]
})
export class AngularSvgIconComponent implements OnInit, OnDestroy {
  @Input() text: string = '';
  @Input() icon: string = '';
  @Input() iconClass: string = '';

  appHeader = {
    backgroundColor: '#222',
    height: '50px',
    width: 'auto',
    color: 'red'
  };

  left = { display: 'inline', textAlign: 'left' };
  middle = { display: 'inline', textAlign: 'center' };
  right = { display: 'inline', textAlign: 'right' };

  rotatingImageStyle = {
    animation: 'rotate3d 10s infinite alternate',
    width: '50px'
  };

  showImage = true;
  rotateValue = 'rotateX(360deg) rotateY(360deg) rotateZ(360deg)';

  ngOnInit() {
    // Set up rotation interval
    this.startRotation();
  }

  ngOnDestroy() {
    // Clear interval on destroy
    if (this.rotateInterval) {
      clearInterval(this.rotateInterval);
    }
  }

  private rotateInterval: any;

  private startRotation() {
    this.rotateInterval = setInterval(() => {
      this.rotateValue = this.rotateValue === 'rotateX(360deg) rotateY(360deg) rotateZ(360deg)'
        ? 'rotateX(0) rotateY(0) rotateZ(0)'
        : 'rotateX(360deg) rotateY(360deg) rotateZ(360deg)';
    }, 10000);
  }
}
