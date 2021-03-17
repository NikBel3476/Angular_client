import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../server.service';

import { User } from '../user';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css'],
})
@Injectable({
  providedIn: 'root'
})
export class AuthorizationComponent implements OnInit {

  user: User = {
    login: '',
    nickname: '',
    password: ''
  }

  token: string = '';
  type: string = 'authorization';

  EVENTS = this.serverService.getEvents();

  constructor(private router: Router, private serverService: ServerService) {
    serverService.on(this.EVENTS.LOGIN, (data: any) => this.onGetToken(data))
    serverService.on(this.EVENTS.REGISTRATION, (data: any) => this.onGetToken(data))
  }


  ngOnInit(): void {
  }

  // тип: авторизация или регистрация
  setType(type: string): void {
    this.type = type;
  }

  authorization() {
    this.serverService.login(this.user);
  }

  registration() {
    this.serverService.registration(this.user);
  }

  onGetToken (data: any) {
    if (typeof data === 'string') {
      localStorage.setItem('token', data);
      this.router.navigate(['game']);
    }
  }
}
