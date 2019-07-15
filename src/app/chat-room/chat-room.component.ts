import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatService } from '../chat.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css'],
  providers: [ChatService]
})

export class ChatRoomComponent implements OnInit, OnDestroy {
  roomName = '';
  numberOfUsers = 0;
  messageToSend = '';
  dateTime = Date().split('G', 2)[0];
  username = sessionStorage.getItem('username');
  messageText = '';
  messageArray: Array<{username: string, message: string, timeDate: string}> = [];
  usersInRoom: string[] = [];
  observable1: any;
  observable2: any;
  observable3: any;

  constructor(private router: Router, private chatService: ChatService, private route: ActivatedRoute, private http: HttpClient) {
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

    this.observable1 = this.chatService.newUserJoined().subscribe(data => {
      this.messageArray.push(data);
      this.getUsersInRoom();
    });

    this.observable2 = this.chatService.userLeftTheRoom().subscribe(data => {
      this.messageArray.push(data);
      this.getUsersInRoom();
    });

    this.observable3 = this.chatService.receiveNewMessage().subscribe(data => {
      this.messageArray.push(data);
    });
  }

  ngOnInit() {
  }

  joinRoom() {
    const data = {
      username: this.username,
      roomName: this.roomName,
      timeDate: Date().split('G', 2)[0]
    };
    this.chatService.joinRoom(data);

    setTimeout(() => {
      this.getUsersInRoom();
    }, 1000);
  }

  leaveRoom() {
    const data = {
      username: this.username,
      roomName: this.roomName,
      timeDate: Date().split('G', 2)[0]
    };
    this.chatService.leaveRoom(data);
  }

  sendMessage() {
    const data = {
      username: this.username,
      roomName: this.roomName,
      message: this.messageText,
      timeDate: Date().split('G', 2)[0]
    };
    this.messageText = '';
    this.chatService.sendMessage(data);
  }

  @HostListener('window:beforeunload', [ '$event' ])
  beforeUnloadHandler(event) {
    this.leaveRoom();
  }

  ngOnDestroy() {
    console.log('ngondestroy');
    this.observable1.unsubscribe();
    this.observable2.unsubscribe();
    this.observable3.unsubscribe();
  }

  getUsersInRoom() {
    this.http.get('http://localhost:3000/getUsersInRoom?roomName=' + this.roomName, { responseType: 'json'}).subscribe(
      (response: any[]) => {
        console.log(response[0].usersInRoom);
        this.usersInRoom = response[0].usersInRoom;
        this.numberOfUsers = this.usersInRoom.length;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
