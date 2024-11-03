import { Component } from '@angular/core';

@Component({
  selector: 'app-other-features',
  template: `
    <div [ngStyle]="styles">
      <p>Other applications:</p>
      <ul [ngStyle]="uStyles">
        <li>ServerAPI with React, Vue and Blazor clients</li>
        <li>WebAPI Data Traffic with NServiceBus</li>
        <li>Data Traffic with Custom Data Queue</li>
        <li>Add Services to WebAPI</li>
        <li>Hangfire, Postman and Swagger</li>
        <li>Docker, Docker Orchestration and Docker-Compose</li>
        <li>Orchestration with Kubernetes</li>
        <li>Security in Web Applications</li>
        <li>State Machine</li>
        <li>Broadcast Messaging in Angular</li>
        <li>Ramanujan's Factorial Aproximation</li>
      </ul>
    </div>
  `,
  styles: []
})
export class OtherFeaturesComponent {
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
