import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
  }

  logIn() {
    const args = {
      username: this.username,
      password: this.password
    };

    this.http.post('http://localhost:3000/login', args, {responseType: 'json'}).subscribe(
      (response: any[]) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
    this.router.navigateByUrl('home');
  }
}
