import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { GameComponent } from './game/game.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    AuthorizationComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule.forRoot([
      {path: 'game', component: GameComponent},
      {path: 'authorization', component: AuthorizationComponent},
      {path: '', redirectTo: '/authorization', pathMatch: 'full'},
      {path: '**', redirectTo: '/authorization', pathMatch: 'full'}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})



export class AppModule { }
