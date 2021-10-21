import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Observer, of } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketsService {

  private devBE:string='http://localhost:8080/';
  private prodBE:string='https://delivery-prototype-backend.herokuapp.com/';
  private pathBE:string = '';  

  public socket:any;

  public message$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor() { 
    this.pathBE=this.devBE;
  }

  setupSocketConnection() {
    const url = this.pathBE;
    this.socket = io(url,{ transports : ['websocket'] });
  }

  disconnect() {
      (this.socket && this.socket.disconnect() );      
  }


  findUserchat(body:any) {
    this.socket.emit('find-userchat', body);
  }

  userMessages = () =>{
    return new Observable((observer: Observer<object>) => {
      this.socket.on('find-userchat', (data:any) => {
          observer.next(data);
        });
    });
  }

  sendMessage(message:any) {
    this.socket.emit('new-message-user', message);
  }

  getNewMessage = () => {
    return new Observable((observer: Observer<object>) => {
        this.socket.on('new-message-user', (data:any) => {
          observer.next(data);
        });
    });
  }

  setCerrarSession = () => {
    this.socket.emit('cerrar-session','');
  }
  setIniciarSession= () => {
    this.socket.emit('iniciar-session','');
  }

  getNewMessageMl= () => {
    return new Observable((observer: Observer<object>) => {
        this.socket.on('new-message-ml', (data:any) => {
          observer.next(data);
        });
    });
  }

}
