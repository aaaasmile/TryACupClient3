import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResourceLoader,SoundIds,ImagesIds } from '../../common/gfx/resource-loader'
import * as createjs from 'createjs-module';

@Component({
  moduleId: module.id,
  selector: 'my-testcard2',
  templateUrl: 'testcard2.component.html'
})

export class TestCardComponent2 implements OnInit {
  private mainStage: createjs.Stage;


  constructor(
    private router: Router,
    private resourceLoader: ResourceLoader) {
  }

  ngOnInit(): void {
    console.log('Canvas initialization');
    this.mainStage = new createjs.Stage("mainCanvas");

    this.resourceLoader.on("complete", (e: createjs.Event) => {
      console.log('OK - resource');
      // todo remove progress bar
      let table = this.resourceLoader.getImageBitmap(ImagesIds.Table);
      this.mainStage.addChild(table);
      this.mainStage.update();
    });
    // todo add progress bar
    this.resourceLoader.loadResources();
    console.log('Canvas test 2 created');
  }

  switchCard(): void {
    console.log('Switch card');

    createjs.Sound.play(SoundIds.MixSound);
    //createjs.Sound.play(this.sndMixCards);
  }
}