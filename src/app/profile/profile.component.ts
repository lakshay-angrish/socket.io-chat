import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  username: string;
  photo: string;
  birthdate: string;
  gender: string;
  changePasswordBox = false;
  changePhotoBox = false;
  httpHeaders: HttpHeaders;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    if (
      !sessionStorage.getItem("token") ||
      !sessionStorage.getItem("username")
    ) {
      sessionStorage.clear();
      this.router.navigateByUrl("login");
    }
    this.httpHeaders = new HttpHeaders({
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    });
    this.username = sessionStorage.getItem("username");

    this.getUser();
  }

  getUser() {
    this.http
      .get("http://localhost:3000/getUser", {
        responseType: "json",
        headers: this.httpHeaders,
      })
      .subscribe(
        (response: any) => {
          this.photo = response.photo;
          const data = response.birthdate.split("T", 2)[0];
          this.birthdate = new Date(Date.parse(data)).toDateString();
          this.gender = response.gender;
        },
        (error) => {
          console.log(error.message || error.error);
          alert(error.message || error.error);
        }
      );
  }

  deleteUser() {
    this.http
      .delete(
        "http://localhost:3000/deleteUser?username=" +
          this.username +
          "&photo=" +
          this.photo,
        { responseType: "text", headers: this.httpHeaders }
      )
      .subscribe(
        (response) => {
          alert(response);
          sessionStorage.clear();
          this.router.navigateByUrl("");
        },
        (error) => {
          alert(error.message || error.error);
        }
      );
  }

  passwordButtonClicked() {
    this.router.navigateByUrl("change-password");
  }

  photoButtonClicked() {
    this.router.navigateByUrl("change-photo?currentPhoto=" + this.photo);
  }
}
