import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5';
import { io, Socket } from 'socket.io-client';
import { CookieService } from 'ngx-cookie-service';

import { SETTINGS } from './Settings';
import { User } from '../User';
import { Direction } from '../Direction';

@Injectable({
  providedIn: 'root'
})
export class Server {
  socket: Socket
  socketStatus: 'connected' | 'disconnected' = 'disconnected';
  events: { [k: string]: Function[] } = {};

  constructor(
    private cookieService: CookieService
    ) {
    this.socket = io(`${SETTINGS.HOST}:${SETTINGS.PORT}`);

    Object.values(SETTINGS.MESSAGES).forEach(messageName  => this.events[messageName] = []);

    this.socket.on(SETTINGS.MESSAGES.LOGIN, (data: any) =>
      this.fireEvent(SETTINGS.MESSAGES.LOGIN, data));
    this.socket.on(SETTINGS.MESSAGES.REGISTRATION, (data: any) =>
      this.fireEvent(SETTINGS.MESSAGES.REGISTRATION, data));
    this.socket.on(SETTINGS.MESSAGES.LOGOUT, (data: any) =>
      this.fireEvent(SETTINGS.MESSAGES.LOGOUT, data));
    this.socket.on(SETTINGS.MESSAGES.GET_MESSAGE, (data: any) =>
      this.fireEvent(SETTINGS.MESSAGES.GET_MESSAGE, data));
    this.socket.on(SETTINGS.MESSAGES.CREATE_ROOM, (data: any) =>
      this.fireEvent(SETTINGS.MESSAGES.CREATE_ROOM, data));
    this.socket.on(SETTINGS.MESSAGES.JOIN_GAME, (data: any) =>
      this.fireEvent(SETTINGS.MESSAGES.JOIN_GAME, data));
    this.socket.on(SETTINGS.MESSAGES.LEAVE_GAME, (data: any) =>
      this.fireEvent(SETTINGS.MESSAGES.LEAVE_GAME, data));
    this.socket.on(SETTINGS.MESSAGES.GET_GAMES, (data: any) =>
      this.fireEvent(SETTINGS.MESSAGES.GET_GAMES, data));
    this.socket.on(SETTINGS.MESSAGES.USER_ENTER_CHAT, (data: any) =>
      this.fireEvent(SETTINGS.MESSAGES.USER_ENTER_CHAT, data));
    this.socket.on(SETTINGS.MESSAGES.USER_LEAVE_CHAT, (data: any) =>
      this.fireEvent(SETTINGS.MESSAGES.USER_LEAVE_CHAT, data));
    this.socket.on(SETTINGS.MESSAGES.GET_NAMES, (data: any) =>
      this.fireEvent(SETTINGS.MESSAGES.GET_NAMES, data));
    this.socket.on(SETTINGS.MESSAGES.SPEED_CHANGE, (data: any) =>
      this.fireEvent(SETTINGS.MESSAGES.SPEED_CHANGE, data));
    this.socket.on(SETTINGS.MESSAGES.PASSWORD_CHANGE, (data: any) =>
      this.fireEvent(SETTINGS.MESSAGES.PASSWORD_CHANGE, data));
    this.socket.on(SETTINGS.MESSAGES.LOGOUT_ALL_USERS, (data: any) =>
      this.fireEvent(SETTINGS.MESSAGES.LOGOUT_ALL_USERS, data));
    this.socket.on(SETTINGS.MESSAGES.GAMERS_INFO, (data: any) =>
      this.fireEvent(SETTINGS.MESSAGES.GAMERS_INFO, data));
    this.socket.on(SETTINGS.MESSAGES.CHANGE_DIRECTION, (data: any) =>
      this.fireEvent(SETTINGS.MESSAGES.CHANGE_DIRECTION, data));

    this.socket.on('connect', () => {
      console.log('sockets connected');
      this.socketStatus = 'connected';
    });
    this.socket.on('disconnect', () =>  {
      console.log('sockets disconnected');
      this.socketStatus = 'disconnected';
    });
  }

  private fireEvent(name: string, data: any): void {
    this.events[name]?.forEach((event: Function) => event(data));
  }

  on(name: string, func: Function): void {
      this.events[name]?.push(func);
  }

  getEvents(): { [k: string]: string }  {
    return SETTINGS.MESSAGES;
  }

  // АВТОРИЗАЦИЯ И РЕГИСТРАЦИЯ
  // -------------------------
  login(user: User): void {
    const { login, password } = user;
    if (login && password) {
      const num = Math.round(Math.random() * 1000000);
      const passHash = Md5.hashStr(login + password);
      const hash = Md5.hashStr(passHash + String(num));
      this.socket.emit(SETTINGS.MESSAGES.LOGIN, { login, hash, num });
    }
  }

  registration(user: User): void {
    const { login, nickname, password } = user;
    if (nickname && login && password) {
      const passHash = Md5.hashStr(login + password);
      this.socket.emit(SETTINGS.MESSAGES.REGISTRATION, { login, nickname, passHash });
    }
  }

  checkAuth(): void {
    this.socket.emit(SETTINGS.MESSAGES.CHECK_AUTH);
  }

  logout(): void {
    const token = this.cookieService.get('token');
    if (token) {
      this.socket.emit(SETTINGS.MESSAGES.LOGOUT, token);
    }
  }

  changePassword(login: string, oldPassword: string, newPassword: string): void {
    const oldHash = Md5.hashStr(login + oldPassword);
    const newHash = Md5.hashStr(login + newPassword);
    this.socket.emit(SETTINGS.MESSAGES.CHANGE_PASSWORD, { login, oldHash, newHash });
  }

  logoutAllUsers(secretWord: string): void {
    this.socket.emit(SETTINGS.MESSAGES.LOGOUT_ALL_USERS, { secretWord });
  }

  // ЧАТ
  // --------------------------
  sendMessage(message: string): void {
    if (message) {
      const token: string = this.cookieService.get('token');
      const room: string = this.cookieService.get('room');
      this.socket.emit(SETTINGS.MESSAGES.SEND_MESSAGE, { message, token, room});
    }
  }

  // КОМНАТЫ
  // --------------------------
  createRoom(roomName: string): void {
    const data = {
      roomName,
      token: this.cookieService.get('token')
    }
    this.socket.emit(SETTINGS.MESSAGES.CREATE_ROOM, data);
  }

  joinGame(gameName: string): void {
    const data = {
      gameName,
      token: this.cookieService.get('token')
    };
    this.socket.emit(SETTINGS.MESSAGES.JOIN_GAME, data);
  }

  leaveGame(): void {
    this.socket.emit(
      SETTINGS.MESSAGES.LEAVE_GAME, { gameName: this.cookieService.get('game'), token: this.cookieService.get('token') }
    );
  }

  getGames(): void {
    this.socket.emit(SETTINGS.MESSAGES.GET_GAMES);
  }

  // ИГРА
  // -------------------------------
  move(direction: Direction): void {
    this.socket.emit(
      SETTINGS.MESSAGES.MOVE, { gameName: 'firstGame', direction, token: this.cookieService.get('token')});
  }

  stopMove(): void {
    this.socket.emit(SETTINGS.MESSAGES.STOP_MOVE);
  }

  changePosition(position: object): void {
    const data = {
      position,
      gameName: this.cookieService.get('game'),
      token: this.cookieService.get('token')
    };
    this.socket.emit(SETTINGS.MESSAGES.CHANGE_POSITION, data);
  }

  changeCameraRotation(rotationParams: object): void {
    const data = {
      rotationParams,
      gameName: this.cookieService.get('game'),
      token: this.cookieService.get('token')
    };
    this.socket.emit(SETTINGS.MESSAGES.CHANGE_DIRECTION, data);
  }

  getNames(): void {
    this.socket.emit(SETTINGS.MESSAGES.GET_NAMES);
  }

  speedUp(): void {
    this.socket.emit(SETTINGS.MESSAGES.SPEED_UP);
  }

  speedDown(): void {
    this.socket.emit(SETTINGS.MESSAGES.SPEED_DOWN);
  }
}
