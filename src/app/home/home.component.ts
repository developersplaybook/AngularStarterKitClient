import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment'; 
import { InfoMessageComponent} from './info/info-component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  apiAddress: string = environment.apiAddress;
  currentTicks: number = new Date().getTime();
  imageUrl: string = `${this.apiAddress}/RandomHandler/Index/PhotoID=0/Size=M?${this.currentTicks}`;
  detailsRoute: string = `/photodetails/0`;
  downloadUrl: string = `${this.apiAddress}/RandomHandler/Download/0/M?${this.currentTicks}`;

  constructor() { }

  ngOnInit(): void {
    this.loadWeatherWidget();
  }

  loadWeatherWidget() {
    const script = document.createElement("script");
    script.src = "https://weatherwidget.io/js/widget.min.js";
    script.async = true;

    script.onload = () => {
      setTimeout(() => {
        const divWeather = document.getElementById("divWeather");
        if (divWeather) {
          divWeather.classList.add("delayed-fade-in-animation");
        }

        this.currentTicks = new Date().getTime();
      }, 1000); // 1-second delay after script loading
    };

    script.onerror = () => {
      console.error("Failed to load the weather widget script.");
    };

    document.body.appendChild(script);
  }
}
