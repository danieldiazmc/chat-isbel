import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  registrar(body:any) {
    localStorage.setItem('name',body.name);
    localStorage.setItem('id',body.idUser);    
  }

  getStorage(){
    return (localStorage.getItem('name')) ? {name:localStorage.getItem('name'), id:localStorage.getItem('id')} : null;
  }

  cleanStorage(){
    localStorage.removeItem('name');
    localStorage.removeItem('id');
  }
}
