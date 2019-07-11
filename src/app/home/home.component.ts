import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import io from 'socket.io-client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  numberOfRooms = 0;
  roomName = 'Public';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
  }

  createNewRoom() {

  }
}
