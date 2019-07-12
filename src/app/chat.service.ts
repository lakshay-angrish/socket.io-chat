import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket = io('http://localhost:3000');

  constructor(private router: Router) { }

  joinRoom(data) {
    this.socket.emit('join', data);
  }

  newUserJoined() {
    const observable = new Observable<{username: string, message: string}>(observer => {
      this.socket.on('new user joined', data => {
        observer.next(data);
      });
      return () => { this.socket.disconnect(); };
    });
    return observable;
  }

  leaveRoom(data) {
    this.socket.emit('leave', data);
  }

  userLeftTheRoom() {
    const observable = new Observable<{username: string, message: string}>(observer => {
      this.socket.on('left the room', data => {
        observer.next(data);
      });
      return () => { this.socket.disconnect(); };
    });
    return observable;
  }

  sendMessage(data) {
    this.socket.emit('message', data);
  }

  receiveNewMessage() {
    const observable = new Observable<{username: string, message: string}>(observer => {
      this.socket.on('new message', data => {
        observer.next(data);
      });
      return () => { this.socket.disconnect(); };
    });
    return observable;
  }
}
