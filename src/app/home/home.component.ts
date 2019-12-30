import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  numberOfRooms = 0;
  newRoomName = '';
  roomName = 'Public';
  allRooms: any[];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.getAllRooms();
  }

  getAllRooms() {
    this.http.get('http://localhost:3000/getAllRooms', {responseType: 'json'}).subscribe(
      (response: any[]) => {
        this.numberOfRooms = response.length;
        if (this.numberOfRooms > 0) {
          this.allRooms = response;
        }
      },
      (error) => {
        alert(error.message);
      }
    );
  }

  createRoom() {
    if (this.newRoomName === '') {
      alert('Room must have a name!');
    } else {
      const args = {
        roomName: this.newRoomName,
        usersInRoom: []
      };

      this.http.post('http://localhost:3000/createRoom', args, {responseType: 'text'}).subscribe(
        (response) => {
          alert(response);
          this.getAllRooms();
        },
        (error) => {
          alert(error.message);
        }
      );
    }
  }
}
