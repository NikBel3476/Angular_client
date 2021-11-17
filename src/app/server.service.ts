import { Injectable } from '@angular/core';
import { Euler } from 'three';

import { Direction } from './Direction';
import { Server } from './server/Server';
import { User } from './User';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private server: Server) {

  }

  getEvents(): { [k: string]: string } {
    return this.server.getEvents();
  }

  on(name: string, func: any): void {
    this.server.on(name, func);
  }

  // АВТОРИЗАЦИЯ И РЕГИСТРАЦИЯ
  login(user: User): void {
    this.server.login(user);
  }

  registration(user: User): void {
    this.server.registration(user);
  }

  checkAuth(): void {
    this.server.checkAuth();
  }

  sendMessage(message: string): void {
    this.server.sendMessage(message);
  }

  logout(): void {
    this.server.logout();
  }

  logoutAllUsers(secretWord: string): void {
    this.server.logoutAllUsers(secretWord);
  }

  createRoom(roomName: string): void {
    this.server.createRoom(roomName);
  }

  joinGame(roomName: string): void {
    this.server.joinGame(roomName);
  }

  leaveGame(): void {
    this.server.leaveGame();
  }

  getRooms(): void {
    this.server.getGames();
  }

  // ИГРА
  // -------------------------------
  move (direction: Direction): void {
    this.server.move(direction);
  }

  stopMove(): void {
    this.server.stopMove();
  }

  changePosition(position: object): void {
    this.server.changePosition( position );
  }

  changeCameraRotation(rotationParams: Euler): void {
    this.server.changeCameraRotation(rotationParams);
  }

  getNames(): void {
    this.server.getNames();
  }

  speedUp(): void {
    this.server.speedUp();
  }

  speedDown(): void {
    this.server.speedDown();
  }

  changePassword(login: string, oldPassword: string, newPassword: string): void {
    this.server.changePassword(login, oldPassword, newPassword);
  }
}
