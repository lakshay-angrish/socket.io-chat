import { Component, OnInit, Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Router } from '@angular/router';
// import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css'],
  // providers: [ChatService]
})
// @Injectable()
export class ChatRoomComponent implements OnInit {
  roomName = 'Public';
  numberOfUsers = 0;
  messageToSend = '';
  dateTime = Date().split('G', 2)[0];
  username = sessionStorage.getItem('username');
  messageText = 'message';
  socket = io('http://localhost:3000');

  constructor(private router: Router) {
  }

  ngOnInit() {
    if (this.username === null) {
      alert('You Must Login First!');
      this.router.navigateByUrl('');
    }
    this.getChatHistory();
  }

  sendMessage() {
    this.socket.emit('chat message', this.messageToSend);

    this.socket.on('chat message', (msg) => {
      console.log(msg);
    });
  }

  getChatHistory() {

  }

}
