import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginOutFormComponent } from './login-out-form.component';

describe('LoginOutFormComponent', () => {
  let component: LoginOutFormComponent;
  let fixture: ComponentFixture<LoginOutFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginOutFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginOutFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
