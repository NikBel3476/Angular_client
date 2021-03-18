import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { GameComponent } from './game/game.component';
import { RegistrationComponent } from './registration/registration.component';
import { HeaderComponent } from './header/header.component';

const config: SocketIoConfig = { url: 'http://localhost:3001/', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    AuthorizationComponent,
    GameComponent,
    RegistrationComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SocketIoModule.forRoot(config),
    RouterModule.forRoot([
      {path: 'game', component: GameComponent},
      {path: 'authorization', component: AuthorizationComponent},
      {path: 'registration', component: RegistrationComponent},
      {path: '', redirectTo: '/authorization', pathMatch: 'full'},
      {path: '**', redirectTo: '/authorization', pathMatch: 'full'}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})



export class AppModule { }
