import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-frame-bar',
  templateUrl: './frame-bar.component.html',
  styleUrls: ['./frame-bar.component.scss']
})
export class FrameBarComponent {
  @ViewChild('elCollapseButton', { static: false })
  elCollapseButton!: ElementRef;
  @ViewChild('sidebar') sidebarRef!: ElementRef;

  logoPath = 'assets/images/logo.png';
  hamburgerPath = 'assets/images/Hamburger.png';

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
    const mainContent = document.getElementById('main-content');
    if (this.sidebarOpen) {
      mainContent?.classList.add('content-blur');
    } else {
      mainContent?.classList.remove('content-blur');
    }
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
    document.getElementById('main-content')?.classList.remove('content-blur');
  }

  handleResize(): void {
    if (window.innerWidth >= 992) {
      this.closeSidebar();
    }
  }

  getCss(spriteType: string, dayNumber: number): string {
    return `transparent url('/assets/images/Bootstrap${spriteType}Composed.jpg') 0 ${
      -81 * dayNumber
    }px`;
  }

  logo = this.logoPath;
  hamburger = this.hamburgerPath;
  
  sidebarOpen = false;
  dayNumber = new Date().getDay() % 12;
  todaysHeaderCss = this.getCss('Header', this.dayNumber);
  todaysFooterCss = this.getCss('Footer', this.dayNumber);

  ngOnInit(): void {
    this.elCollapseButton?.nativeElement.addEventListener(
      'click',
      this.toggleSidebar.bind(this)
    );
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  ngOnDestroy(): void {
    this.elCollapseButton.nativeElement.removeEventListener(
      'click',
      this.toggleSidebar.bind(this)
    );
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  ngAfterViewInit(): void {
    // Ensure that elCollapseButton is defined before accessing nativeElement
    if (this.elCollapseButton) {
      this.elCollapseButton.nativeElement.addEventListener(
        'click',
        this.toggleSidebar.bind(this)
      );
    }
  }
}
