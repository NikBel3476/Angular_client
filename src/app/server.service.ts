import { Injectable } from '@angular/core';
import { Server } from './server/Server';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private server: Server) {
    
  }

  getEvents() {
    return this.server.getEvents();
  }

  on(name: string, func: any){
    this.server.on(name, func);
  }

  login(user: User) {
    this.server.login(user);
  }

  registration(user: User) {
    this.server.registration(user);
  }

  sendMessage(message: String) {
    this.server.sendMessage(message);
  }

  logout() {
    this.server.logout();
  }

  createRoom(roomName: string) {
    this.server.createRoom(roomName);
  }

  joinRoom(roomName: string) {
    this.server.joinRoom(roomName);
  }

  leaveRoom(roomName: any) {
    this.server.leaveRoom(roomName);
  }

  getRooms() {
    this.server.getRooms();
  }

}
