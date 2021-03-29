import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../server.service';

import { User } from '../user';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css'],
})
export class AuthorizationComponent implements OnInit {

  user: User = {
    login: '',
    password: ''
  }

  EVENTS = this.serverService.getEvents();

  constructor(private router: Router, private serverService: ServerService) {
    serverService.on(this.EVENTS.LOGIN, (data: any) => this.onGetToken(data))
  }

  ngOnInit(): void {
  }

  authorization() {
    this.serverService.login(this.user);
    delete this.user.password;
  }

  onGetToken(data: any) {
    if (typeof data === 'string') {
      localStorage.setItem('token', data);
      this.router.navigate(['game']);
    }
  }
}
