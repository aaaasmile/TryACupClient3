import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as createjs from 'createjs-module';
import { Subscription } from 'rxjs';
import { InGameMessage } from 'src/app/data-models/socket/InGameMessage';
import { CurrGameStateService } from 'src/app/services/curr-game-state.service';

@Component({
  moduleId: module.id,
  selector: 'my-briscola-in-due',
  templateUrl: 'briscola-in-due.component.html'
})

export class BriscolaInDueComponent implements OnInit {
  private mainStage: createjs.Stage;
  private imgTmp;
  private subsc_msg: Subscription;
  private subsc_chat: Subscription;

  constructor(
    private gameStateService: CurrGameStateService,
    private router: Router) {
  }

  ngOnInit(): void {
    // if (this.gameStateService.bufferInGameMsg.length == 0) {
    //   this.onCacheProcTerminated()
    // } else {
    //   this.processCache()
    // }
    // this.subsc_chat = this.gameStateService.subscribeChatMsg()
    //   .subscribe(chat => {
    //     console.warn("todo chat processing", chat)
    //   })

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

  onCacheProcTerminated() {
    this.gameStateService.stopCollectInGame()
    this.subsc_msg = this.gameStateService.subscribeInGameMsg()
      .subscribe(mi => {
        this.processInGameMsg(mi)
      })
  }

  processCache(){
    let cm = this.gameStateService.popFrontInGameMsg()
    while(cm){
      this.processInGameMsg(cm)
      cm = this.gameStateService.popFrontInGameMsg()
    }
    this.onCacheProcTerminated()
  }

  processInGameMsg(msg: InGameMessage) {
    console.warn("Todo process in game message", msg)
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
      console.log('Image Loaded');
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

    this.mainStage.update();
    console.log('Canvas created');
  }

}
