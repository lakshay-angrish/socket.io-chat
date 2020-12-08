import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit {
  username: string;
  gender: string;
  birthdate: Date;
  password: string;
  confirmPassword: string;
  errorMessage: string;
  photo: File;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {}

  photoSelected(event) {
    this.photo = event.target.files[0];
  }

  signUp() {
    if (this.password === this.confirmPassword) {
      const data = new FormData();
      data.append("username", this.username);
      data.append("gender", this.gender);
      data.append("birthdate", this.birthdate.toString());
      data.append("password", this.password);
      if (this.photo) {
        data.append("photo", this.photo);
      }

      this.http
        .post("http://localhost:3000/signup", data, { responseType: "text" })
        .subscribe(
          (response) => {
            alert(response);
            this.router.navigateByUrl("");
          },
          (error) => {
            alert(error.error);
            this.errorMessage = error.error;
          }
        );
    }
  }
}
