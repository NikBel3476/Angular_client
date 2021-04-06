import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../server.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  EVENTS = this.serverService.getEvents();

  constructor(private router: Router, private serverService: ServerService) {
    serverService.on(this.EVENTS.LOGOUT, (result: any) => this.onLogout(result));
  }

  ngOnInit(): void {
  }
  
  logout() {
    this.serverService.logout();
  }

  onLogout(result: any) {
    if (result) {
      localStorage.removeItem('token');
      this.router.navigate(['authorization']);
    }
  }

}
