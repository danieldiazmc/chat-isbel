import { Component, OnInit } from '@angular/core';
import { SocketsService } from './services/sockets.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'chat-app';
  constructor(private socketsService: SocketsService) {}
  
  ngOnInit() {
    this.socketsService.setupSocketConnection();
  }

  ngOnDestroy() {
    this.socketsService.disconnect();
  }

}
