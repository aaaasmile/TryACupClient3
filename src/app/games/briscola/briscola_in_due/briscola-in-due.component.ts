import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as createjs from 'createjs-module';
import { Subscription } from 'rxjs';
import { InGameMessage } from 'src/app/data-models/socket/InGameMessage';
import { CurrGameStateService } from 'src/app/services/curr-game-state.service';
import { ChatItem } from 'src/app/game-list/chat-item';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
  moduleId: module.id,
  selector: 'my-briscola-in-due',
  templateUrl: 'briscola-in-due.component.html'
})

export class BriscolaInDueComponent implements OnInit {
  private mainStage: createjs.Stage;
  private imgTmp;
  private tableIx: string;
  private subsc_msg: Subscription;
  private subsc_chat: Subscription;
  chatMsgs: ChatItem[];
  

  constructor(
    private gameStateService: CurrGameStateService,
    private authService: AuthenticationService,
    private router: Router) {
      this.tableIx = "1" // TODO get from route
  }

  ngOnInit(): void {
    if (this.authService.isAvailable()){
    this.chatMsgs = new Array<ChatItem>();
    this.gameStateService.getAllChatMesages(this.tableIx).forEach(element => {
      let ci = new ChatItem(element)
        this.chatMsgs.push(ci)
    });
    this.subsc_chat = this.gameStateService.subscribeChatMsg()
      .subscribe(cm => {
        let ci = new ChatItem(cm)
        this.chatMsgs.push(ci)
      })
    this.subsc_msg = this.gameStateService.InGameMsgRecEvent
      .subscribe(evt => {
        console.log("InGame message received ")
        let cm = this.gameStateService.popFrontInGameMsg(this.tableIx)
      });
    }
    this.testSomeCanvas()
  }

  ngOnDestroy() {
    if (this.subsc_msg) {
      this.subsc_msg.unsubscribe()
    }
    if (this.subsc_chat) {
      this.subsc_chat.unsubscribe()
    }
  }

  processCache(){
    let cm = this.gameStateService.popFrontInGameMsg(this.tableIx)
    while(cm){
      this.processInGameMsg(cm)
      cm = this.gameStateService.popFrontInGameMsg(this.tableIx)
    }
  }

  processInGameMsg(msg: InGameMessage) {
    console.warn("Todo process in game message", msg)
  }

  sendChatMsg(msg) {
    if (msg) {
      console.log('send chat msg: ', msg)
      this.gameStateService.sendChatTableMsg(msg, this.tableIx)
    }
  }

  imageLoaded(): void {
    console.log('Image loaded ', this.imgTmp);
    let card = new createjs.Bitmap(this.imgTmp);
    card.x = 30;
    card.y = 20;
    this.mainStage.addChild(card);

    this.mainStage.update();
  }

  testSomeCanvas() {
    console.log('Canvas initialization');
    this.mainStage = new createjs.Stage("mainCanvas");
    var circle = new createjs.Shape();
    circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;
    this.mainStage.addChild(circle);

    var title = new createjs.Text();
    title.text = 'Briscola Rocks!';
    title.font = '14px Georgia';
    title.color = 'black';
    title.x = 10;
    title.y = 10;
    this.mainStage.addChild(title);

    this.imgTmp = new Image();
    this.imgTmp.src = "assets/carte/piac/01_denar.png";
    //this.imgTmp.onload = this.imageLoaded;
    this.imgTmp.onload = () => {
      console.log('Example image Loaded');
      let card = new createjs.Bitmap(this.imgTmp);
      //card.x = 30;
      //card.y = 20;
      this.mainStage.addChild(card);
      this.mainStage.update();
    }

    // let card = new createjs.Bitmap("/dist/res/carte/piac/01_denar.png");
    // card.x = 30;
    // card.y = 20;
    // this.mainStage.addChild(card);
    let cardLoader = this.gameStateService.getCardLoaderGfx()
    cardLoader.loadCards(this.authService.get_deck_name())

    this.mainStage.update();
    console.log('Canvas created');
  }

}
