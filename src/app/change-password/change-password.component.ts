import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

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

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.username = sessionStorage.getItem("username");
    if (this.username === null) {
      alert("You must be logged in!");
      this.router.navigateByUrl("");
    }
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
