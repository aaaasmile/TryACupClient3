import { Injectable } from '@angular/core';
import * as createjs from 'createjs-module';

export class SoundIds {
  static ClickSound = "Click";
  static MixSound = "Mix";
}

export class ImagesIds {
  static Table = "Table";
}

@Injectable()
export class ResourceLoader extends createjs.EventDispatcher {
  private queue = new createjs.LoadQueue(false);
  private bitmaps = {};

  loadResources() {
    console.log('Start to load resources...')
    this.queue.installPlugin(createjs.Sound);
    this.queue.on("complete", (e: createjs.Event) => {
      this.dispatchEvent(e);
      console.log('All resources loaded');
    });

    this.queue.on("fileload", (e: createjs.Event) => {
      console.log('File loaded: ');
    });

    

    //this.queue.loadFile({ id: SoundIds.ClickSound, src: "/dist/res/sound/click_4bit.wav" });
    this.queue.loadFile({ id: SoundIds.ClickSound, src: "assets/sound/click_4bit.wav" });
    //this.queue.loadFile("assets/sound/click_4bit.wav");
    //this.queue.loadFile({ id: SoundIds.MixSound, src: "assets/sound/mischen1.wav" });
     this.queue.loadManifest([
       { id: ImagesIds.Table, src: "assets/images/table/table.png" }
     ]);
    this.queue.load()
  }

  getImageBitmap(imageID: string): createjs.Bitmap {
    if (!this.bitmaps[imageID]){
      this.bitmaps[imageID] = new createjs.Bitmap(this.queue.getResult(imageID));
    }
    return this.bitmaps[imageID];
  }
}