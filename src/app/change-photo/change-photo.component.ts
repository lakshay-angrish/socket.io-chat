import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-change-photo',
  templateUrl: './change-photo.component.html',
  styleUrls: ['./change-photo.component.css']
})
export class ChangePhotoComponent implements OnInit {
  photo: File;
  currentPhoto: string;
  username: string;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {
    route.queryParams.subscribe(args => {
      this.currentPhoto = args.currentPhoto;
    });
  }

  ngOnInit() {
    this.username = sessionStorage.getItem('username');

    if (this.username === null) {
      alert('You must be logged in!');
      this.router.navigateByUrl('');
    }
  }

  photoSelected(event) {
    this.photo = event.target.files[0];
  }

  changePhoto() {
    const data = new FormData();
    if (this.photo) {
      data.append('photo', this.photo);
    }
    data.append('currentPhoto', this.currentPhoto);
    data.append('username', this.username);

    this.http.put('http://localhost:3000/changePhoto', data, {responseType: 'text'}).subscribe(
      (response) => {
        if (response["nModified"] === 1) {
          alert(response);
        }
        this.router.navigateByUrl('profile');
      },
      (error) => {
        alert(error);
      }
    );
  }
}
