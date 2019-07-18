import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePhotoComponent } from './change-photo/change-photo.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
  {
    path: '', component: LoginComponent
  },
  {
    path: 'signup', component: SignupComponent
  },
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'chat-room', component: ChatRoomComponent
  },
  {
    path: 'profile', component: ProfileComponent
  },
  {
    path: 'change-photo', component: ChangePhotoComponent
  },
  {
    path: 'change-password', component: ChangePasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
