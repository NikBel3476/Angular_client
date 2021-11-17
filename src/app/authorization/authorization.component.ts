import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ServerService } from '../server.service';

import { User } from '../User';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css'],
})
export class AuthorizationComponent implements OnInit {

  HOUR: number = 60 * 60 * 1000;

  user: User = {
    login: '',
    password: ''
  }

  EVENTS = this.serverService.getEvents();

  constructor(
    private router: Router,
    private serverService: ServerService,
    private cookieService: CookieService
  ) {
    serverService.on(this.EVENTS.LOGIN, (data: { result: boolean, token: string }) => this.onAuthComplete(data));
  }

  ngOnInit(): void {
    this.serverService.checkAuth();
    if (this.cookieService.get('token') && this.serverService.getSocketStatus()) {
      this.router.navigate(['rooms']);
    }
  }

  authorization(): void {
    this.serverService.login(this.user);
    delete this.user.password;
  }

  onAuthComplete(data: { result: boolean, token: string}): void {
    if (data.result) {
      this.cookieService.set('token', data.token, new Date(Date.now() + this.HOUR));
      this.router.navigate(['rooms']);
    }
  }
}
