import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumFrameComponent } from './album-frame.component';

describe('AlbumFrameComponent', () => {
  let component: AlbumFrameComponent;
  let fixture: ComponentFixture<AlbumFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlbumFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlbumFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
