import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResourceLoader, SoundIds, ImagesIds } from '../../common/gfx/resource-loader'

@Component({
  moduleId: module.id,
  selector: 'my-testcard2',
  templateUrl: 'testcard2.component.html'
})

export class TestCardComponent2 implements OnInit {
  private mainStage: createjs.Stage;
  private audio_resumed: boolean = false

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
    console.log('Switch card and play sound');


    if (!this.audio_resumed) {
      try {
        //if (createjs.WebAudioPlugin.context.state === "suspended") {
          createjs.WebAudioPlugin.context.resume();
          // Should only need to fire once
          console.log('plugin resumed')
          this.audio_resumed = true
        //}
      } catch (e) {
        // SoundJS context or web audio plugin may not exist
        console.error("There was an error while trying to resume the SoundJS Web Audio context...");
        console.error(e);
      }

      console.log('Try to play sound')
      createjs.Sound.play(SoundIds.ClickSound);
      createjs.Sound.registerSound("assets/sound/Game-Break.ogg", SoundIds.ClickSound)
      createjs.Sound.on('fileload', function (event) {
        console.log('file loaded')
        createjs.Sound.play(SoundIds.ClickSound);
        var instance = createjs.Sound.play(SoundIds.ClickSound);
        if (instance == null || instance.playState == createjs.Sound.PLAY_FAILED) {
          console.log('Play failed', instance)
          return;
        }
      });
    }




    //createjs.Sound.pla(SoundIds.MixSound)
    //createjs.Sound.play(this.sndMixCards);
  }
}