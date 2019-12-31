# CHAT.IO

Chat.IO is a real-time web chat app. It uses socket.io for real-time, bidirectional communication with clients and the server. It is written using the MEAN stack of technologies.

## Features

- Create user accounts and store the details in the database for verifying logins.
- Create chat rooms and the ability to join created rooms.
- Send text messages and emojis in a chat-room.
- All the chats are backed-up in the database.
- The chat history of room can be cleared within a room by a user.
- The user can leave any room at any time and join another or just logout.
- The user can see his/her profile information on a dedicated Profile page. On this page, the user can update his/her profile picture and/or password. Also, he can delete his account.
- When in a room, the user can see other users currently in the room and gets a notification when any user leaves or a new user joins the room.

## Setup
1. use ``` git clone https://github.com/lakshay-angrish/socket.io-chat ``` to clone this repository.
2. cd into that directory and run ```npm install```. This will install all dependencies.
3. run ```sudo systemctl start mongodb``` to activate the database.
4. run ```nodemon server.js``` to run the node.js server to listen for requests.
5. open another terminal and run ```ng serve -o```to launch the app. A browser tab would open with the web app live.
