import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalStateService } from '../services/global-state.service';

@Component({
  selector: 'app-frame-bar',
  templateUrl: './frame-bar.component.html',
  styleUrls: ['./frame-bar.component.scss']
})
export class FrameBarComponent {
  @ViewChild('elCollapseButton', { static: false })
  elCollapseButton!: ElementRef;
  @ViewChild('sidebar') sidebarRef!: ElementRef;
  showLoginModal :boolean = false;
  logoPath = 'assets/images/logo.png';
  hamburgerPath = 'assets/images/Hamburger.png';
  private subscriptions: Subscription[] = [];
  constructor(
    private globalStateService: GlobalStateService,

  ) {
    this.showLoginModal = this.globalStateService.showLoginModalSubject.value;
  }

  
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

  openShowLoginModal(): void {
    this.globalStateService.setShowLoginModal(true);
    this.closeSidebar();
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
    this.subscriptions.push(
      this.globalStateService.showLoginModalSubject.subscribe(modal => {
        console.log("modal", modal);
        this.showLoginModal = modal;
      })
    );

    this.elCollapseButton?.nativeElement.addEventListener(
      'click',
      this.toggleSidebar.bind(this)
    );
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
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
