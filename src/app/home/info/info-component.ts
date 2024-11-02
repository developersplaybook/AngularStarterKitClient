import { Component } from '@angular/core';

@Component({
    selector: 'app-info-message',
    template: `
        <div [ngStyle]="styles">
            <div>
                Thank you for purchasing
                <em>The Aspiring Full Stack Developer's Playbook: From AI to Microservices and Kubernetes</em>.
                I hope you find the book and the accompanying code both enjoyable and practically useful.
                <p [ngStyle]="redStyles">Don't forget to leave a review on Amazon!</p>
                If you have any questions or feedback, feel free to email me&mdash;my contact information is in the book.
            </div>
            <p>Please check:</p>
            <ul>
                <li>Authorization with JSON WebToken</li>
                <li>File upload with drag & drop</li>
                <li>Handling of HTTPContext.Session</li>
                <li>State Management with React Context API</li>
                <li>Storage of passwords and secret keys in ServerAPI</li>
                <li>Unobtrusive validation</li>
                <li>SQLite database in ServerAPI</li>
            </ul>
        </div>
    `,
    styles: []
})
export class InfoMessageComponent {
    styles = {
        'background-color': 'rgb(20, 0, 80)',
        color: 'white',
        padding: '20px',
        'font-family': 'Arial, sans-serif',
    };

    redStyles = {
        'background-color': 'rgb(20, 0, 80)',
        color: 'red',
        padding: '20px',
        'font-family': 'Arial, sans-serif',
    };
}