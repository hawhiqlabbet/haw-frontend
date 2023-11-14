import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
//import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { GamesComponent } from './games/games.component';
import { TabBarComponent } from './tab-bar/tab-bar.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AnimatedHeaderComponent } from './animated-header/animated-header.component';
import { HostingCardComponent } from './hosting-card/hosting-card.component';
import { LaunchPageComponent } from './launch-page/launch-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RoomPageComponent } from './room-page/room-page.component';
import { environment } from './../environments/environment';


//const config: SocketIoConfig = { url: environment.apiUrl, options: { autoConnect: false } };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GamesComponent,
    TabBarComponent,
    AnimatedHeaderComponent,
    HostingCardComponent,
    LaunchPageComponent,
    RegisterPageComponent,
    LoginPageComponent,
    RoomPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    //SocketIoModule.forRoot(config),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
