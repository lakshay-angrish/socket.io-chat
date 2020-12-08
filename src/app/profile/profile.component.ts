import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username: string;
  photo: string;
  birthdate: string;
  gender: string;
  changePasswordBox = false;
  changePhotoBox = false;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.username = sessionStorage.getItem('username');
    if (this.username === null) {
      alert('You must be logged in to view profile!');
      this.router.navigateByUrl('');
    }

    this.getUser();
  }

  getUser() {
    this.http.get('http://localhost:3000/getUser?username=' + this.username, { responseType: 'json'}).subscribe(
      (response: any) => {
        this.photo = response.photo;
        const data = ((response.birthdate).split('T', 2))[0];
        this.birthdate = (new Date(Date.parse(data))).toDateString();
        this.gender = response.gender;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteUser() {
    this.http.delete('http://localhost:3000/deleteUser?username=' +
    this.username + '&photo=' + this.photo, { responseType: 'text'}).subscribe(
      (response) => {
        alert(response);
        sessionStorage.clear();
        this.router.navigateByUrl('');
      },
      (error) => {
        alert(error);
      }
    );
  }

  passwordButtonClicked() {
    this.router.navigateByUrl('change-password');
  }

  photoButtonClicked() {
    this.router.navigateByUrl('change-photo?currentPhoto=' + this.photo);
  }
}
