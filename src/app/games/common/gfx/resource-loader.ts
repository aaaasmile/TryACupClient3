import { Injectable } from '@angular/core';
import { Log4Cup } from '../../../shared/log4cup'
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
  private _log: Log4Cup = new Log4Cup('ResourceLoader');
  private queue = new createjs.LoadQueue;
  private bitmaps = {};

  loadResources() {
    this.queue.installPlugin(createjs.Sound);
    this.queue.on("complete", (e: createjs.Event) => {
      this.dispatchEvent(e);
      this._log.debug('Resource loaded');
    });

    //this.queue.loadFile({ id: SoundIds.ClickSound, src: "/dist/res/sound/click_4bit.wav" });
    this.queue.loadFile({ id: SoundIds.ClickSound, src: "assets/sound/click_4bit.wav" });
    this.queue.loadFile({ id: SoundIds.MixSound, src: "assets/sound/mischen1.wav" });
    this.queue.loadManifest([
      { id: ImagesIds.Table, src: "assets/images/table/table.png" }
    ]);

  }

  getImageBitmap(imageID: string): createjs.Bitmap {
    if (!this.bitmaps[imageID]){
      this.bitmaps[imageID] = new createjs.Bitmap(this.queue.getResult(imageID));
    }
    return this.bitmaps[imageID];
  }
}