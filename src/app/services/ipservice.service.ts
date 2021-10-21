import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IpserviceService {

  constructor(private http: HttpClient) {  }

  getIP() {

    return this.http.get('https://ipapi.co/json/');

  }


}
