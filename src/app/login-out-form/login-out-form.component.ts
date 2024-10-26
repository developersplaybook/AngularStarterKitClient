import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalStateService } from './../services/global-state.service';
import { ApiHelperService } from './../services/api-helper.service';
import { lastValueFrom } from 'rxjs';
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
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private globalStateService: GlobalStateService,
    private apiService: ApiHelperService
  ) {
    this.passwordForm = this.fb.group({
      password: ['']
    });
    this.apiAddress = this.apiService.getApiAddress();
    this.isAuthorized = this.globalStateService.isAuthorizedSubject.value;
    this.token = this.globalStateService.tokenSubject.value ? this.globalStateService.tokenSubject.value: '';
  }

  ngOnInit(): void {
    this.globalStateService.isAuthorized.subscribe(authStatus => {
      this.isAuthorized = authStatus;
      this.isAuthorized ? this.captionText="Log out":this.captionText="Log in"
    });
  }

  handleClose(): void {
    this.router.navigate(['albums']);
  }

  async checkPasswordOnServerAsync(password: string): Promise<any> {
    try {
      const response = await lastValueFrom(this.apiService.postHelper(`${this.apiAddress}/api/authorization/login`,{ Password: password },''));
      return response;
    } catch (error) {
      console.error('Error in checkPasswordOnServerAsync:', error);
      this.captionText = 'Wrong password, try again...';
      throw error;
    }
  }

  async logOutUserAsync(): Promise<any> {
    try {
      const response = await lastValueFrom(this.apiService.postHelper(`${this.apiAddress}/api/authorization/logout`, {},''));
      return response;
    } catch (error) {
      console.error('Error in logOutUserAsync:', error);
      throw error;
    }
  }

  async handleLogInOut(): Promise<void> {
    this.loading = true;
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
      this.loading = false;
    }
  }
}
