import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit(): void {
  }

  logout(): void {
    localStorage.setItem('token', '');
  }

  ngOnDestroy(): void {
    localStorage.clear();
  }

}
