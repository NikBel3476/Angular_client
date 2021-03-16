import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../user';
import { Server } from '../server/Server';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent implements OnInit {

  server = new Server();

  user: User = {
    login: '',
    nickname: '',
    password: ''
  }

  token: string = '';

  type: string = 'authorization';

  constructor(private router: Router) {
    
  }

  ngOnInit(): void {
  }

  // тип: авторизация или регистрация
  setType(type: string): void {
    this.type = type;
  }

  authorization = () => {
    this.server.login(this.user);
  }

  registration = () => {
    this.server.registration(this.user);
  }

}
