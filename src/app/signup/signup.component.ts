import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  username: string;
  gender: string;
  birthdate: Date;
  password: string;
  confirmPassword: string;
  errorMessage: string;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
  }

  signUp() {
    if (this.password === this.confirmPassword) {
      const args = {
        username: this.username,
        gender: this.gender,
        birthdate: this.birthdate,
        password: this.password
      };

      this.http.post('http://localhost:3000/signup', args, {responseType: 'text'}).subscribe(
        (response) => {
          this.errorMessage = response;
          alert('Please Login to Proceed');
          this.router.navigateByUrl('');
        },
        (error) => {
          this.errorMessage = error;
        }
      );
    }
  }
}
