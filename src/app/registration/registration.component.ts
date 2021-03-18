import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../server.service';

import { User } from '../user';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class RegistrationComponent implements OnInit {

  user: User = {
    login: '',
    nickname: '',
    password: ''
  }

  EVENTS = this.serverService.getEvents();

  constructor(private router: Router, private serverService: ServerService) {
    serverService.on(this.EVENTS.REGISTRATION, (data: any) => this.onGetToken(data))
  }

  ngOnInit(): void {
  }

  registration() {
    this.serverService.registration(this.user);
  }

  onGetToken(data: any) {
    if (typeof data === 'string') {
      localStorage.setItem('token', data);
      this.router.navigate(['game']);
    }
  }

}
