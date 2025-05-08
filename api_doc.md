# ChatVerse API Documentation

## Models:

_User_

- username: string, unique (required)
- email: string, unique (required)
- password: string (required)
- status: string (default "Offline")
- avatar: string (default image URL)

_Room_

- name: string (required)
- createdBy: integer (userId of creator)
- inviteCode: string, unique (required)

_RoomUser_

- RoomId: integer (required)
- UserId: integer (required)
- role: string ("admin" or "member")

_Message_

- content: text (required)
- UserId: integer (required)
- isBot: boolean (required)
- RoomId: integer (required)


## Relationships:

### **One-to-Many**

- A `User` has many `Messages`
- A `User` has many `RoomUsers`
- A `Room` has many `RoomUsers`
- A `Room` has many `Messages`

## Endpoints:

List of available endpoints:

- `POST /register`
- `POST /login`
- `POST /login/google`

Routes below need authentication:

- `GET /groups`
- `POST /groups`
- `GET /groups/join/:inviteCode`
- `POST /groups/:groupId`
- `GET /groups/:groupId`
- `GET /chats`
- `POST /chats`

&nbsp;

## 1. POST /register

Description: Register a new user

Request:

- body:

```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string"
}
```

_Response (201 - Created)_

```json
{
  "id": "integer",
  "username": "string",
  "email": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Username is required"
}
OR
{
  "message": "Email is required"
}
OR
{
  "message": "Password is required"
}
OR
{
  "message": "Invalid email format"
}
OR
{
  "message": "Username must be unique"
}
OR
{
  "message": "Email must be unique"
}
OR
{
  "message": "Password and confirm password must be the same"
}
OR
{
  "message": "Confirm password is required"
}
```

&nbsp;

## 2. POST /login

Description: User login with username

Request:

- body:

```json
{
  "username": "string"
}
```

_Response (200 - OK)_

```json
{
  "access_token": "string",
  "user": {
    "id": "integer",
    "username": "string",
    "email": "string",
    "status": "string",
    "avatar": "string"
  }
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Username is required"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid username"
}
```

&nbsp;

## 3. POST /login/google

Description: Login using Google authentication

Request:

- body:

```json
{
  "googleToken": "string"
}
```

_Response (200 - OK)_

```json
{
  "access_token": "string",
  "user": {
    "id": "integer",
    "username": "string",
    "email": "string",
    "avatar": "string"
  }
}
```

&nbsp;

## 4. GET /groups

Description: Get all rooms/groups the user is a member of

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
[
  {
    "id": "integer",
    "RoomId": "integer",
    "UserId": "integer",
    "role": "string",
    "createdAt": "timestamp",
    "updatedAt": "timestamp",
    "Room": {
      "id": "integer",
      "name": "string",
      "createdBy": "integer",
      "inviteCode": "string",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  }
]
```

_Response (404 - Not Found)_

```json
{
  "message": "No Room found for this user"
}
```

&nbsp;

## 5. POST /groups

Description: Create a new room/group

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- body:

```json
{
  "name": "string"
}
```

_Response (201 - Created)_

```json
{
  "message": "Room created",
  "room": {
    "id": "integer",
    "name": "string",
    "inviteCode": "string",
    "createdBy": "integer",
    "updatedAt": "timestamp",
    "createdAt": "timestamp"
  }
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Room name is required"
}
```

&nbsp;

## 6. GET /groups/join/:inviteCode

Description: Join a room/group using an invite code

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- params:

```json
{
  "inviteCode": "string"
}
```

_Response (200 - OK)_

```json
{
  "message": "Successfully joined the room.",
  "room": {
    "id": "integer",
    "name": "string"
  }
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Room not found"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "You are already a member of this Room."
}
```

&nbsp;

## 7. POST /groups/:groupId

Description: Send a message to a group

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- params:

```json
{
  "groupId": "integer"
}
```

- body:

```json
{
  "content": "string"
}
```

_Response (201 - Created)_

```json
{
  "id": "integer",
  "content": "string",
  "RoomId": "integer",
  "isBot": false,
  "UserId": "integer",
  "updatedAt": "timestamp",
  "createdAt": "timestamp"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Message is required"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Room not found"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "You are not a member of this room"
}
```

&nbsp;

## 8. GET /groups/:groupId

Description: Get messages from a group

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- params:

```json
{
  "groupId": "integer"
}
```

_Response (200 - OK)_

```json
[
  {
    "id": "integer",
    "content": "string",
    "UserId": "integer",
    "isBot": "boolean",
    "RoomId": "integer",
    "createdAt": "timestamp",
    "updatedAt": "timestamp",
    "User": {
      "id": "integer",
      "username": "string"
    }
  }
]
```

_Response (403 - Forbidden)_

```json
{
  "message": "You are not a member of this room"
}
```

&nbsp;

## 9. GET /chats

Description: Get AI chat history

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
[
  {
    "text": "string"
  }
]
```

&nbsp;

## 10. POST /chats

Description: Send message to AI assistant

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- body:

```json
{
  "text": "string"
}
```

_Response (201 - Created)_

```json
{
  "userMessage": {
    "text": "string"
  },
  "aiMessage": {
    "text": "string"
  }
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Message text is required"
}
```

&nbsp;

## Global Error

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error",
  "error": "error details"
}
```

## Socket.IO Events

### Server Events (emit)

- `chat.verse`: Emits the updated chat history after a new message
- `mySocketId`: Emits the socket ID to the user upon joining a room
- `handShakeAuth`: Emits authentication data to the user upon joining a room
- `newMessage`: Emits a new message to all users in a room

### Client Events (listen)

- `connection`: Triggered when a user connects to the socket
- `join_group`: User joins a specific group
- `chat.verse`: User sends a message to the AI assistant
