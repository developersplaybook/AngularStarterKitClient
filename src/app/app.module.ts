import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FrameBarComponent } from './frame-bar/frame-bar.component';
import { AlbumsComponent } from './albums/albums.component';
import { HomeComponent } from './home/home.component';
import { PhotoFrameComponent } from './photo-frame/photo-frame.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { PhotoDetailsComponent } from './photodetails/photo-details.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { AngularSvgIconComponent } from './angular-svg-icon/angular-svg-icon.component';
import { TextAreaInputComponent } from './text-area-input/text-area-input.component';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { PhotosComponent } from './photos/photos.component';
import { LoginOutFormComponent } from './login-out-form/login-out-form.component';
import { AlbumFrameComponent } from './album-frame/album-frame.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { InfoMessageComponent } from './home/info/info-component'; // Adjust the path as necessary


@NgModule({
  declarations: [
    FrameBarComponent,
    PhotoFrameComponent,
    AppComponent,
    AlbumsComponent,
    HomeComponent,
    PhotoDetailsComponent,
    FileUploadComponent,
    AngularSvgIconComponent,
    TextAreaInputComponent,
    DeleteConfirmationComponent,
    PhotosComponent,
    LoginOutFormComponent,
    AlbumFrameComponent,
    InfoMessageComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    DpDatePickerModule,
    FontAwesomeModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
