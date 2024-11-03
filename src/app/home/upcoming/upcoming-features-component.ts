import { Component } from '@angular/core';

@Component({
  selector: 'app-upcoming-features',
  template: `
    <div [ngStyle]="styles">
      <p>Planned features:</p>
      <ul [ngStyle]="uStyles">
        <li>React with Typescript</li>
        <li>Vite as alternative to react-scripts for building React applications</li>
      </ul>
    </div>
  `,
  styles: []
})
export class UpcomingFeaturesComponent {
  styles = {
    'background-color': 'rgb(20, 0, 80)',
    color: 'white',
    padding: '20px',
    'font-family': 'Arial, sans-serif'
  };

  uStyles = {
    'list-style-image': 'none',
    'list-style-type': 'disc',
    'padding-left': '20px'
  };
}
