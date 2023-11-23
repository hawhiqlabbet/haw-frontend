import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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
import { UserCircleComponent } from './user-circle/user-circle.component';
import { AnimatedGameTextComponent } from './animated-game-text/animated-game-text.component';
import { SpyqGameComponent } from './spyq-game/spyq-game.component';

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
    RoomPageComponent,
    UserCircleComponent,
    AnimatedGameTextComponent,
    SpyqGameComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
