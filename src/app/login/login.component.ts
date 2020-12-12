import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  errorMessage: string;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    if (sessionStorage.getItem("username")) {
      this.router.navigateByUrl("home");
    }
  }

  logIn() {
    const args = {
      username: this.username,
      password: this.password,
    };

    this.http
      .post("http://localhost:3000/login", args, { responseType: "json" })
      .subscribe(
        (response: any) => {
          console.log(response);
          sessionStorage.setItem("username", this.username);
          sessionStorage.setItem("token", response.token);
          this.router.navigateByUrl("home");
        },
        (error) => {
          console.log(error);
          this.errorMessage = error.error;
        }
      );
  }
}
