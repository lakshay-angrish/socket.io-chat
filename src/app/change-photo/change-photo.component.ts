import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: "app-change-photo",
  templateUrl: "./change-photo.component.html",
  styleUrls: ["./change-photo.component.css"],
})
export class ChangePhotoComponent implements OnInit {
  photo: File;
  currentPhoto: string;
  username: string;
  httpHeaders: HttpHeaders;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    route.queryParams.subscribe((args) => {
      this.currentPhoto = args.currentPhoto;
    });
  }

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

  photoSelected(event) {
    this.photo = event.target.files[0];
  }

  changePhoto() {
    const data = new FormData();
    if (this.photo) {
      data.append("photo", this.photo);
    }
    data.append("currentPhoto", this.currentPhoto);

    this.http
      .put("http://localhost:3000/changePhoto", data, {
        responseType: "text",
        headers: this.httpHeaders,
      })
      .subscribe(
        (response) => {
          if (response["nModified"] === 1) {
            alert(response);
          }
          this.router.navigateByUrl("profile");
        },
        (error) => {
          alert(error.error || error.message);
        }
      );
  }
}
