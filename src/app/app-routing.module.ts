import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AlbumsComponent } from './albums/albums.component';
import { PhotoDetailsComponent } from './photodetails/photo-details.component';
import { PhotosComponent } from './photos/photos.component';
import { LoginOutFormComponent } from './login-out-form/login-out-form.component';

const routes: Routes = [

  {
    path: '',
    component: HomeComponent
  },
  { 
    path: 'user',
    component: LoginOutFormComponent
  },
  {
    path: 'albums',
    component: AlbumsComponent,
  },
  {
    path: "photos/:albumId",
    component: PhotosComponent,
  },
  {
    path: "photodetails/:photoId",
    component: PhotoDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
