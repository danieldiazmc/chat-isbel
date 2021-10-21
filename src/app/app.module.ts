import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { ChatboxComponent } from './components/chatbox/chatbox.component';
import { SocketsService } from './services/sockets.service';

@NgModule({
  declarations: [
    AppComponent,
    ChatboxComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule
  ],
  providers: [SocketsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
