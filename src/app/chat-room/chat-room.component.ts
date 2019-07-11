import { Component, OnInit} from '@angular/core';
import io from 'socket.io-client';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css'],
  providers: [ChatService]
})

export class ChatRoomComponent implements OnInit {
  roomName = '';
  numberOfUsers = 0;
  messageToSend = '';
  dateTime = Date().split('G', 2)[0];
  username = sessionStorage.getItem('username');
  messageText = 'message';
  messageArray: Array<{username: string, message: string}> = [];

  constructor(private router: Router, private chatService: ChatService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(args => {
      this.roomName = args.roomName;
    });

    if (this.username === null) {
      alert('You Must Login First!');
      this.router.navigateByUrl('');
    }
    if (this.roomName === null) {
      alert('You Must Join a Room First!');
      this.router.navigateByUrl('home');
    }
    this.joinRoom();
    this.chatService.newUserJoined().subscribe(data => {
      this.messageArray.push(data);
    });
  }

  joinRoom() {
    const data = {
      username: sessionStorage.getItem('username'),
      roomName: this.roomName
    };
    this.chatService.joinRoom(data);
  }

}
