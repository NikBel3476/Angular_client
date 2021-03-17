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
}
