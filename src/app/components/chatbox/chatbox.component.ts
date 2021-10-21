import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IpserviceService } from 'src/app/services/ipservice.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SocketsService } from 'src/app/services/sockets.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss']
})
export class ChatboxComponent implements OnInit {

  public registerName: string= '';
  public ipAddres: string= '';
  public socketID: string='';
  public newMessage: string= '';
  public messageList:any[]=[];
  public habilitar:boolean=true;

  public box1:boolean=true;
  public box2:boolean=false;

  constructor(
    private socketsService: SocketsService,
    private ipserviceService: IpserviceService,
    private usersService: UsersService,
    private storage: LocalStorageService
  ) { }

  ngOnInit(){

    // Obtengo la direccion IP
    this.obtenerIP();

    // Consulto si existe un usuario registrado en el localStorage
    this.verifyUser()

    if(this.storage.getStorage()){
      //Habilito el Socket que se encarga de escuchar los mensajes
      this.getMessagesUser();
      //Conectamos con ML
      this.getMessagesMl();
    }

    

    // Consulto por el usuario que este registrado en el localStorage
    this.userMessages();
    
  }

  verifyUser(){
    let storage = this.storage.getStorage();
    if( storage ){
      // Muestro el 2do box del Chat
      this.cambiarBoxs();

      //Busco todos los mensajes del usuario activo
      this.usersService.getAllMessages(storage).subscribe( (res:any) => {
        res.results.forEach((e:any) => {
          let products = e.emisor == 'ml' ? e.products[0] : '';
          this.messageList.push( {text:e.text,emisor:e.emisor,products} );
        }); 
      });

    }    
  }

  userMessages(){
    this.socketsService.userMessages().subscribe((result:any)=> {
      result.messages.forEach((e:any) => {
        this.messageList.push( {text:e.text,emisor:e.emisor} );
      });      
    })
  }

  getMessagesUser(){
    this.socketsService.getNewMessage().subscribe((message:any)=> {
      this.addMensajeToList(message);
    })
  }

  getMessagesMl(){
    this.socketsService.getNewMessageMl().subscribe((products:any)=> {
      products.forEach((element:any) => {
        let {thumbnail,
            permalink,
            title,
            price,
            currency_id} = element;
        this.messageList.push( {emisor:'ml',products:{thumbnail,permalink,title,price,currency_id}} );
      });
      this.newMessage = ''; 
    })
  }

  sendMessage() {
    let obj = {message:this.newMessage,...this.storage.getStorage()};
    this.addMensajeToList( {text:this.newMessage,emisor:'user'} ) ;
    this.socketsService.sendMessage(obj);
  }

  actionRegisterName(){
    this.habilitar=false;
    if(this.registerName !== ''){   
      this.usersService.register({ip:this.ipAddres,name:this.registerName}).subscribe( (res:any) =>{
        this.storage.registrar(res.results);
        this.addMensajeToList(res.results.messages[0]);
        this.cambiarBoxs();
      });

    }else{
      alert('Debe ingresar un nombre');
    }
  }

  actionCerrarSession(){
    this.usersService.desconectChat().subscribe( (res:any) =>{
      alert('SOCKET session cerrada');
      
    });
  }

  actionIniciarSession(){
    this.socketsService.setIniciarSession();
  }

  cleanStorage(){
    this.storage.cleanStorage();
    this.usersService.desconectChat().subscribe( (res:any) =>{
      this.cambiarBoxs();
      this.messageList=[];
      alert('session cerrada');
    });
  }

  addMensajeToList(messages:any){
    let {emisor,text} = messages;
    this.messageList.push( {emisor,text} );
    this.newMessage = ''; 
  }

  cambiarBoxs(){
    this.box1=!this.box1;
    this.box2=!this.box2;
  }

  obtenerIP(){
    this.ipserviceService.getIP().subscribe( (res:any) => {
      this.ipAddres = res.ip;
    }); 
  }

}
