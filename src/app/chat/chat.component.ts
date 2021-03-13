import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  template: `
    <input id="textLine" (value)="testFunc($event)">,
  `,
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  message = "";

  testFunc() {
    console.log(this.message);
  }
  
}
