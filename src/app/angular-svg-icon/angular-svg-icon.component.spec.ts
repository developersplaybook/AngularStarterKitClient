import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularSvgIconComponent } from './angular-svg-icon.component';

describe('AngularSvgIconComponent', () => {
  let component: AngularSvgIconComponent;
  let fixture: ComponentFixture<AngularSvgIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AngularSvgIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AngularSvgIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
