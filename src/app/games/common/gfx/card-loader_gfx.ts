import { DeckInfo } from "../deck-info";
import * as createjs from 'createjs-module';
import { Subject, Observable } from "rxjs";

export class CardLoaderGfx {
  private deck_france: boolean
  private nomi_semi = ["basto", "coppe", "denar", "spade"]
  private nomi_simboli = ["cope", "zero", "xxxx", "vuot"]
  private current_deck_type = ''
  private cards = []
  private symbols_card = []
  private cards_rotated = []
  private deck_information = new DeckInfo();
  public scene_background: createjs.Bitmap;

  getProgressGfx(canvas:any){
    let that = {}
    let loaderColor = createjs.Graphics.getRGB(247, 247, 247);
    let loaderColor2 = createjs.Graphics.getRGB(247, 247, 247);
    let loaderBar = new createjs.Container();
    let bar = new createjs.Shape();
    let barHeight = 20
    bar.graphics.beginFill(loaderColor2).drawRect(0, 0, 1, barHeight).endFill();
    let loaderWidth = canvas.width - 20;
    let bgBar = new createjs.Shape();
    let padding = 3
    bgBar.graphics.setStrokeStyle(1).beginStroke(loaderColor).drawRect(-padding / 2, -padding / 2, loaderWidth + padding, barHeight + padding);
    loaderBar.x = canvas.width - loaderWidth >> 1;
    loaderBar.y = canvas.height - barHeight >> 1;
    console.log("Canvas size is: ", canvas.width, canvas.height)
    loaderBar.addChild(bar, bgBar);
    that["loaderBar"] = loaderBar
    that["bar"] = bar
    that["loaderWidth"] = loaderWidth
    return that
  }

  loadResources(folder: string): Observable<number> {
    let that = this
    // Nota sull'implementazione: uso Observable anzichè Subject
    // in quanto il Subject è per il multicast. In questo caso ho una semplice promise.
    // Qui viene fatto un wrapper di tutta la funzione e Observable.create(...) la 
    // deve includere tutta. In questo caso devo anche usare let that = this. 
    let obsLoader = Observable.create(function (obs) {
      let card_fname = ""
      let num_cards_onsuit = that.getNumCardOnSuit(folder)
      if (that.deck_france) {
        num_cards_onsuit = 13
        that.nomi_simboli = ['simbo', 'simbo', 'simbo']
        that.nomi_semi = ["fiori", "quadr", "cuori", "picch"]
      }
      let totItems = that.nomi_semi.length * num_cards_onsuit + that.nomi_simboli.length
      totItems += 1 // table background
      
      console.log("Load cards from folder %s and type %s", folder, that.current_deck_type)
      if (that.current_deck_type === folder) {
        console.log("Avoid to load a new card deck")
        obs.next(totItems)
        obs.next(totItems)
        obs.complete()
        return obs
      }
      that.cards = []
      that.cards_rotated = []
      that.symbols_card = []
      let folder_fullpath = "assets/carte/" + folder + "/"
      console.log("Load cards...")
      if (num_cards_onsuit === 13) {
        that.deck_information.activateThe52deck()
      } else {
        that.deck_information.setToDeck40()
      }

      let countToLoad = 0
      let countLoaded = 0
      
      obs.next(totItems)
      for (let i = 0; i < that.nomi_semi.length; i++) {
        let seed = that.nomi_semi[i]
        for (let index = 1; index <= num_cards_onsuit; index++) {
          let ixname = `${index}`
          if (index < 10) {
            ixname = '0' + ixname
          }
          card_fname = `${folder_fullpath}${ixname}_${seed}.png`
          //console.log('Card fname is: ', card_fname)
          let img = new Image()
          img.src = card_fname
          countToLoad += 1
          img.onload = () => {
            //console.log('Image Loaded: ', img.src);
            let card = new createjs.Bitmap(img);
            that.cards.push(card)
           // setInterval(x => {
              countLoaded += 1
              obs.next(countLoaded)
              if (countToLoad <= countLoaded) {
                obs.complete()
              }
             // }}, 5000)
          }
        }
      }
      // symbols
      console.log("Load all symbols...")
      for (let i = 0; i < that.nomi_simboli.length; i++) {
        let seed = that.nomi_simboli[i]
        card_fname = `${folder_fullpath}01_${seed}.png`
        let img = new Image()
        img.src = card_fname
        countToLoad += 1
        img.onload = () => {
          console.log('Image Loaded: ', img.src);
          let symb = new createjs.Bitmap(img);
          that.symbols_card.push(symb)
          countLoaded += 1
          obs.next(countLoaded)
          if (countToLoad <= countLoaded) {
            obs.complete()
          }
        }
      }
      // background
      let img = new Image()
      img.src = "assets/images/table/table.png"
      countToLoad += 1
        img.onload = () => {
          console.log('Image Loaded: ', img.src);
          let bmp = new createjs.Bitmap(img);
          that.scene_background = bmp 
          countLoaded += 1
          obs.next(countLoaded)
          if (countToLoad <= countLoaded) {
            obs.complete()
          }
        }
      that.current_deck_type = folder
    })
    return obsLoader
  }

  getNumCardOnSuit(folder): number {
    switch (folder) {
      case "bergamo":
      case "milano":
      case "napoli":
      case "piac":
      case "sicilia":
        return 10
      case "treviso":
      case "francesi":
        return 13
    }
  }
}
