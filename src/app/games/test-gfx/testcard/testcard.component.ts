import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as createjs from 'createjs-module';

@Component({
  moduleId: module.id,
  selector: 'my-testcard',
  templateUrl: 'testcard.component.html'
})

export class TestCardComponent implements OnInit {
  private mainStage: createjs.Stage;
  private imgTmp;

  constructor(
    private router: Router) {
  }

  ngOnInit(): void {
    console.log('Canvas initialization');
    this.mainStage = new createjs.Stage("mainCanvas");
    
    var title = new createjs.Text();
    title.text = 'Testing the card';
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

  imageLoaded(): void {
    console.log('Image loaded ', this.imgTmp);
    let card = new createjs.Bitmap(this.imgTmp);
    card.x = 30;
    card.y = 20;
    this.mainStage.addChild(card);

    this.mainStage.update();
  }

}