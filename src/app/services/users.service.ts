import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private devBE:string='http://localhost:8080/api/';
  private prodBE:string='https://delivery-prototype-backend.herokuapp.com/api/';
  private pathBE:string = '';  
  private header:any; 

  constructor(private http: HttpClient) {
    this.pathBE=this.devBE;
    this.header = new HttpHeaders();
    this.header.set('x-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MDUwNGI1NmNhYmJkZDMzY2NmZjM3OTciLCJpYXQiOjE2MjA5NjkyNTMsImV4cCI6MTYyMDk4MzY1M30.dJz2Gm73BO6chJMWsxT3XEmALtLSlesO4WX4wseXf00');
  }

  register(body:any):Observable<any> {
      const url = this.pathBE+'chats/register';
      return this.http.post<any>(url, body).pipe(
        catchError(this.handleError)
      );   
  }

  getAllMessages(body:any):Observable<any>  {
      const url = this.pathBE+`chats/query?idUserChat=${body.id}`;
      return this.http.get<any>(url, {headers: this.header}).pipe(
        catchError(this.handleError)
      ); 
  }

  desconectChat():Observable<any> {
    const url = this.pathBE+'chats/desconect';
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    ); 
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      // console.error(
      //   `Backend returned code ${error.status}, body was: `, error.error);
      alert(error.error.errors)
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }

  
}
