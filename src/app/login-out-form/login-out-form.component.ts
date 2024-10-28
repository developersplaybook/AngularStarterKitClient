import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalStateService } from './../services/global-state.service';
import { ApiHelperService } from './../services/api-helper.service';
import { lastValueFrom, Subscription } from 'rxjs';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';    

@Component({
  selector: 'app-login-out-form',
  templateUrl: './login-out-form.component.html',
  styleUrls: ['./login-out-form.component.scss']
})
export class LoginOutFormComponent implements OnInit {
  faSpinner = faSpinner;
  passwordForm: FormGroup;
  captionText: string = '';
  loading: boolean = false;
  apiAddress: string = '';
  token: string = '';
  isAuthorized:boolean = false;
  showLoginModal: boolean = false;
  get modalBackgroundStyle(): { [key: string]: string } {
    return {
      background: this.showLoginModal ? 'rgba(0,0,0,0.5)' : 'none'
    };
  }
  private subscriptions: Subscription[] = [];
  
  constructor(
    private fb: FormBuilder,
    private globalStateService: GlobalStateService,
    private apiService: ApiHelperService
  ) {
    this.passwordForm = this.fb.group({
      password: ['']
    });
    this.apiAddress = this.apiService.getApiAddress();
    this.isAuthorized = this.globalStateService.isAuthorizedSubject.value;
    this.loading = this.globalStateService.loadingSubject.value;
    this.token = this.globalStateService.tokenSubject.value ? this.globalStateService.tokenSubject.value: '';
    this.showLoginModal = this.globalStateService.showLoginModalSubject.value;
  }

  ngOnInit(): void {
    this.globalStateService.setShowLoginModal(true);
    this.subscriptions.push(
      this.globalStateService.showLoginModalSubject.subscribe(modal => {
        console.log("modal", modal);
        this.showLoginModal = modal;
      })
    );

    this.subscriptions.push(
      this.globalStateService.isAuthorized.subscribe(authStatus => {
        this.isAuthorized = authStatus;
        this.captionText = this.isAuthorized ? "Log out" : "Log in";
      })
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to avoid memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  handleClose(): void {
    if (this.showLoginModal) {
      this.globalStateService.setShowLoginModal(false);
      console.log("handleClose");
    }
  }

  async checkPasswordOnServerAsync(password: string): Promise<any> {
    try {
      const response = await lastValueFrom(this.apiService.postHelper(`${this.apiAddress}/api/authorization/login`,{ Password: password },''));
      return response;
    } catch (error) {
      console.error('Error in checkPasswordOnServerAsync:', error);
      this.captionText = 'Wrong password, try again...';
    }
  }

  async logOutUserAsync(): Promise<any> {
    try {
      const response = await lastValueFrom(this.apiService.postHelper(`${this.apiAddress}/api/authorization/logout`, {},''));
      return response;
    } catch (error) {
      console.error('Error in logOutUserAsync:', error);
    }
  }

  async handleLogInOut(): Promise<void> {
    this.globalStateService.setLoading(true);
    try {
      if (this.isAuthorized) {
        const response = await this.logOutUserAsync();
        if (response.text === 'userLoggedOut' || response.text === 'userAlreadyLoggedOut') {
          this.globalStateService.setIsAuthorized(false);
          this.globalStateService.setToken('');
          this.handleClose();
        }
      } else {
        const response = await this.checkPasswordOnServerAsync(this.passwordForm.value.password);
        if (response && response.token) {
          this.globalStateService.setIsAuthorized(true);
          this.globalStateService.setToken(response.token);
          this.handleClose();
        } else {
          console.error('Login failed or invalid response');
          this.captionText = 'Wrong password, try again...';
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      this.globalStateService.setLoading(false);
    }
  }
}
