import { Component, OnInit } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';

import { User } from '../user';
import { Server } from '../server/Server';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent implements OnInit {

  md5 = new Md5();

  server = new Server;

  user: User = {
    login: '',
    nickname: '',
    password: ''
  }

  type: string = 'authorization';

  constructor() {

  }

  ngOnInit(): void {
  }

  // тип: авторизация или регистрация
  setType(type: string): void {
    this.type = type;
  }

  authorization = () => {
    const { login, password } = this.user;
    const num = Math.round(Math.random() * 1000000);
    if (login && password) {
      const passHash = this.md5.appendStr(login + password).end();
      const token = this.md5.appendStr(passHash + String(num)).end();
      this.server.login({ passHash, token, num});
    }
  }

  registration = () => {
    const { nickname, login, password } = this.user;
    if (nickname && login && password) {
      const passHash = this.md5.appendStr(login + password).end();
      const token = this.md5.appendStr(passHash + String(Math.random() * 100000)).end();
      this.server.registration({ nickname, passHash, token});
    }
  }

  printName = () => {
    console.log(this.user.nickname);
    console.log(this.user.login);
    console.log(this.user.password);
  }

}
