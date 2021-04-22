import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../server.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  EVENTS = this.serverService.getEvents();
  rooms: string[] = [];
  roomName: string =  "";

  constructor(private router: Router, private serverService: ServerService) {
    serverService.on(this.EVENTS.CREATE_ROOM, (result: boolean) => this.onCreateRoom(result));
    serverService.on(this.EVENTS.JOIN_ROOM, (result: any) => this.onJoinRoom(result));
    serverService.on(this.EVENTS.GET_ROOMS, (result: any) => this.onGetRooms(result));
  }

  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['authorization']);
    } else {
      this.serverService.getRooms();
    }
    // this.rooms = this.serverService.getRooms();
  }

  onCreateRoom(data: any): void {
    localStorage.setItem('room', data.room);
    data ? this.router.navigate(['game']) : null;
  }

  createRoom() {
    this.roomName ? this.serverService.createRoom(this.roomName) : null;
  }

  onJoinRoom(data: any) {
    localStorage.setItem('room', data.room);
    data.result ? this.router.navigate(['game']) : null;
  }

  joinRoom(roomName: string) {
    roomName ? this.serverService.joinRoom(roomName) : null;
  }

  getRooms() {
    this.serverService.getRooms();
  }

  onGetRooms(rooms: any) {
    const ROOMS = [];
    for (let room in rooms) {
      ROOMS.push(room);
    }
    this.rooms = ROOMS;
  }

}
