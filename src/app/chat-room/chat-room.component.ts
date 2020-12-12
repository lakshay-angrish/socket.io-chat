import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { Router, ActivatedRoute, NavigationStart } from "@angular/router";
import { ChatService } from "../chat.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: "app-chat-room",
  templateUrl: "./chat-room.component.html",
  styleUrls: ["./chat-room.component.css"],
  providers: [ChatService],
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  roomName = "";
  numberOfUsers = 0;
  messageToSend = "";
  dateTime = Date().split("G", 2)[0];
  username = sessionStorage.getItem("username");
  messageText = "";
  messageArray: Array<{
    username: string;
    message: string;
    timeDate: string;
  }> = [];
  usersInRoom: any[] = [];
  picture: string;
  observable1: any;
  observable2: any;
  observable3: any;
  httpHeaders: HttpHeaders;

  constructor(
    private router: Router,
    private chatService: ChatService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.route.queryParams.subscribe((args) => {
      this.roomName = args.roomName;
    });

    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.getUsersInRoom();
        this.leaveRoom();
      }
    });

    if (this.username === null) {
      alert("You Must Login First!");
      this.router.navigateByUrl("");
    }

    if (this.roomName === null) {
      alert("You Must Join a Room First!");
      this.router.navigateByUrl("home");
    }

    this.joinRoom();

    this.observable1 = this.chatService.newUserJoined().subscribe((data) => {
      this.messageArray.push(data);
      this.getUsersInRoom();
    });

    this.observable2 = this.chatService.userLeftTheRoom().subscribe((data) => {
      this.messageArray.push(data);
      this.getUsersInRoom();
    });

    this.observable3 = this.chatService
      .receiveNewMessage()
      .subscribe((data) => {
        this.messageArray.push(data);
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
    this.getChatHistory();
  }

  joinRoom() {
    const data = {
      username: this.username,
      roomName: this.roomName,
      timeDate: Date().split("G", 2)[0],
    };
    this.chatService.joinRoom(data);

    setTimeout(() => {
      this.getUsersInRoom();
    }, 100);
  }

  leaveRoom() {
    const data = {
      username: this.username,
      roomName: this.roomName,
      timeDate: Date().split("G", 2)[0],
    };
    this.chatService.leaveRoom(data);
  }

  sendMessage() {
    const data = {
      username: this.username,
      roomName: this.roomName,
      message: this.messageText,
      timeDate: Date().split("G", 2)[0],
    };
    this.messageText = "";
    this.chatService.sendMessage(data);
    this.postChat(data);
  }

  @HostListener("window:beforeunload", ["$event"])
  beforeUnloadHandler(event) {
    this.leaveRoom();
  }

  ngOnDestroy() {
    this.observable1.unsubscribe();
    this.observable2.unsubscribe();
    this.observable3.unsubscribe();
  }

  getUsersInRoom() {
    this.http
      .get("http://localhost:3000/getUsersInRoom?roomName=" + this.roomName, {
        responseType: "json",
        headers: this.httpHeaders,
      })
      .subscribe(
        (response: any) => {
          this.usersInRoom = [];
          const users: string[] = response.usersInRoom;
          this.numberOfUsers = users.length;

          for (let i = 0; i !== this.numberOfUsers; i++) {
            this.getUserPhoto(users[i]);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getUserPhoto(user) {
    this.http
      .get("http://localhost:3000/getUser", {
        responseType: "json",
        headers: this.httpHeaders,
      })
      .subscribe(
        (response: any) => {
          this.picture = response.photo;
          const userData = {
            username: user,
            photo: this.picture,
          };

          this.usersInRoom.push(userData);
          console.log(userData);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  postChat(message) {
    this.http
      .post("http://localhost:3000/postChat", message, {
        responseType: "text",
        headers: this.httpHeaders,
      })
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getChatHistory() {
    this.http
      .get("http://localhost:3000/getChatHistory?roomName=" + this.roomName, {
        responseType: "json",
        headers: this.httpHeaders,
      })
      .subscribe(
        (response: any[]) => {
          for (let i = 0; i !== response.length; i++) {
            const data = {
              username: response[i].sender,
              timeDate: response[i].timeDate,
              message: response[i].messageText,
            };
            this.messageArray.push(data);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  clearChatHistory() {
    const sure = confirm(
      "This will delete chats from the database. Are you sure?"
    );

    if (sure) {
      this.messageArray = [];
      this.http
        .delete(
          "http://localhost:3000/clearChatHistory?roomName=" + this.roomName,
          { responseType: "text", headers: this.httpHeaders }
        )
        .subscribe(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }
}
