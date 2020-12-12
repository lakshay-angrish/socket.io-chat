import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.css"],
})
export class ChangePasswordComponent implements OnInit {
  username: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  errorMessage: string;
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
  }

  changePassword() {
    if (this.newPassword === this.confirmNewPassword) {
      const args = {
        username: this.username,
        currentPassword: this.currentPassword,
        newPassword: this.newPassword,
      };

      this.http
        .put("http://localhost:3000/changePassword", args, {
          responseType: "json",
          headers: this.httpHeaders,
        })
        .subscribe(
          (response: any) => {
            console.log(response);
            alert("Successfully Updated");
            this.router.navigateByUrl("profile");
          },
          (error) => {
            this.errorMessage = error.error || error.message;
          }
        );
    } else {
      this.errorMessage = "Passwords do not match";
    }
  }
}
