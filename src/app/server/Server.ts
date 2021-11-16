import {Injectable, NgModule} from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';
import { Socket } from 'ngx-socket-io';
import { CookieService } from 'ngx-cookie-service';

import { SETTINGS } from './Settings';
import { User } from '../user';
import { Direction } from '../Enum';

@Injectable({
  providedIn: 'root'
})
export class Server {

  HOST: string = SETTINGS.HOST;
  PORT: number = SETTINGS.PORT;
  MESSAGES: { [k in keyof typeof SETTINGS.MESSAGES]: string} = SETTINGS.MESSAGES;

  constructor(
    private socket: Socket,
    private cookieService: CookieService
    ) {

    Object.keys(this.EVENTS).forEach(key => this.events[this.EVENTS[key]] = []);

    this.socket.on(this.EVENTS.LOGIN, (data: any) => {
      console.log(socket);
      this.fireEvent(this.EVENTS.LOGIN, data);
    });
    this.socket.on(this.EVENTS.REGISTRATION, (data: any) =>
      this.fireEvent(this.EVENTS.REGISTRATION, data));
    this.socket.on(this.EVENTS.LOGOUT, (data: any) =>
      this.fireEvent(this.EVENTS.LOGOUT, data));
    this.socket.on(this.EVENTS.GET_MESSAGE, (data: any) =>
      this.fireEvent(this.EVENTS.GET_MESSAGE, data));
    this.socket.on(this.EVENTS.CREATE_ROOM, (data: any) =>
      this.fireEvent(this.EVENTS.CREATE_ROOM, data));
    this.socket.on(this.EVENTS.JOIN_GAME, (data: any) =>
      this.fireEvent(this.EVENTS.JOIN_GAME, data));
    this.socket.on(this.EVENTS.LEAVE_GAME, (data: any) =>
      this.fireEvent(this.EVENTS.LEAVE_GAME, data));
    this.socket.on(this.EVENTS.GET_GAMES, (data: any) =>
      this.fireEvent(this.EVENTS.GET_GAMES, data));
    this.socket.on(this.EVENTS.USER_ENTER_CHAT, (data: any) =>
      this.fireEvent(this.EVENTS.USER_ENTER_CHAT, data));
    this.socket.on(this.EVENTS.USER_LEAVE_CHAT, (data: any) =>
      this.fireEvent(this.EVENTS.USER_LEAVE_CHAT, data));
    this.socket.on(this.EVENTS.GET_NAMES, (data: any) =>
      this.fireEvent(this.EVENTS.GET_NAMES, data));
    this.socket.on(this.EVENTS.SPEED_CHANGE, (data: any) =>
      this.fireEvent(this.EVENTS.SPEED_CHANGE, data));
    this.socket.on(this.EVENTS.PASSWORD_CHANGED, (data: any) =>
      this.fireEvent(this.EVENTS.PASSWORD_CHANGED, data));
    this.socket.on(this.EVENTS.LOGOUT_ALL_USERS, (data: any) =>
      this.fireEvent(this.EVENTS.LOGOUT_ALL_USERS, data));
    this.socket.on(this.EVENTS.INFO_ABOUT_THE_GAMERS, (data: any) =>
      this.fireEvent(this.EVENTS.INFO_ABOUT_THE_GAMERS, data));

    this.socket.on('connect', () => console.log("sockets connected"));
  }

  EVENTS: { [key: string]: string } = {
    REGISTRATION: "REGISTRATION",
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
    GET_MESSAGE: "GET_MESSAGE",
    USER_ONLINE: "USER_ONLINE",
    USER_OFFLINE: "USER_OFFLINE",
    CREATE_ROOM: "CREATE_ROOM",
    JOIN_GAME: "JOIN_GAME",
    LEAVE_GAME: "LEAVE_GAME",
    GET_GAMES: "GET_GAMES",
    USER_ENTER_CHAT: 'USER_ENTER_CHAT',
    USER_LEAVE_CHAT: 'USER_LEAVE_CHAT',
    GET_NAMES: "GET_NAMES",
    SPEED_CHANGE: "SPEED_CHANGE",
    PASSWORD_CHANGED: "PASSWORD_CHANGED",
    LOGOUT_ALL_USERS: "LOGOUT_ALL_USERS",
    INFO_ABOUT_THE_GAMERS: "INFO_ABOUT_THE_GAMERS"
  };

  events: { [key: string]: any[] } = {};

  private fireEvent(name: string, data: any): void {
    if (this.events[name]) {
      this.events[name].forEach((event: any) => {
        if (event instanceof Function) {
          event(data);
        }
      });
    }
  }

  on(name: string, func: any): void {
    if (name && this.events[name] && func instanceof Function) {
      this.events[name].push(func);
    }
  }

  getEvents(): { [k: string]: string }  {
    return this.EVENTS;
  }


  // АВТОРИЗАЦИЯ И РЕГИСТРАЦИЯ
  // -------------------------
  login(user: User): void {
    const { login, password } = user;
    if (login && password) {
      const num = Math.round(Math.random() * 1000000);
      const passHash = Md5.hashStr(login + password);
      const hash = Md5.hashStr(passHash + String(num));
      console.log(this.socket);
      this.socket.emit(this.MESSAGES.LOGIN, { login, hash, num });
    }
  }

  registration(user: User): void {
    const { login, nickname, password } = user;
    if (nickname && login && password) {
      const passHash = Md5.hashStr(login + password);
      this.socket.emit(this.MESSAGES.REGISTRATION, { login, nickname, passHash });
    }
  }

  logout(): void {
    const token = this.cookieService.get('token');
    if (token) {
      this.socket.emit(this.MESSAGES.LOGOUT, token);
    }
  }

  changePassword(login: string, oldPassword: string, newPassword: string): void {
    const oldHash = Md5.hashStr(login + oldPassword);
    const newHash = Md5.hashStr(login + newPassword);
    this.socket.emit(this.MESSAGES.CHANGE_PASSWORD, { login, oldHash, newHash });
  }

  logoutAllUsers(secretWord: string): void {
    this.socket.emit(this.MESSAGES.LOGOUT_ALL_USERS, { secretWord });
  }

  // ЧАТ
  // --------------------------
  sendMessage(message: string): void {
    if (message) {
      const token: string = this.cookieService.get('token');
      const room: string = this.cookieService.get('room');
      this.socket.emit(this.MESSAGES.SEND_MESSAGE, { message, token, room});
    }
  }

  // КОМНАТЫ
  // --------------------------
  createRoom(roomName: string): void {
    const data = {
      roomName,
      token: this.cookieService.get('token')
    }
    this.socket.emit(this.MESSAGES.CREATE_ROOM, data);
  }

  joinGame(gameName: string): void {
    const data = {
      gameName,
      token: this.cookieService.get('token')
    };
    this.socket.emit(this.MESSAGES.JOIN_GAME, data);
  }

  leaveGame(): void {
    const data = {
      gameName: this.cookieService.get('game'),
      token: this.cookieService.get('token')
    }
    this.socket.emit(this.MESSAGES.LEAVE_GAME, data);
  }

  getGames(): void {
    this.socket.emit(this.MESSAGES.GET_GAMES);
  }

  // ИГРА
  // -------------------------------
  move(direction: Direction): void {
    this.socket.emit(
      this.MESSAGES.MOVE, { gameName: 'firstGame', direction, token: this.cookieService.get('token')});
  }

  stopMove(): void {
    this.socket.emit(this.MESSAGES.STOP_MOVE);
  }

  changePosition(position: object): void {
    const data = {
      position,
      gameName: this.cookieService.get('game'),
      token: this.cookieService.get('token')
    };
    this.socket.emit(this.MESSAGES.CHANGE_POSITION, data);
  }

  changeCameraRotation(rotationParams: object): void {
    const data = {
      rotationParams,
      gameName: this.cookieService.get('game'),
      token: this.cookieService.get('token')
    };
    this.socket.emit(this.MESSAGES.CHANGE_CAMERA_ROTATION, data);
  }

  getNames(): void {
    this.socket.emit(this.EVENTS.GET_NAMES);
  }


  speedUp(): void {
    this.socket.emit(this.MESSAGES.SPEED_UP);
  }

  speedDown(): void {
    this.socket.emit(this.MESSAGES.SPEED_DOWN);
  }
}
