import { DeckInfo } from "../../common/deck-info";

export class EngineGfx {
  private deck_france: boolean
  private nomi_semi = ["basto", "coppe", "denar", "spade"]
  private nomi_simboli = ["cope", "zero", "xxxx", "vuot"]
  private current_deck_type = ''
  private cards = []
  private cards_rotated = []
  private deck_information = new DeckInfo();

  loadCards(folder: string) {
    let card_fname = ""
    let num_cards_onsuit = this.getNumCardOnSuit(folder)
    if (this.deck_france) {
      num_cards_onsuit = 13
      this.nomi_simboli = ['simbo', 'simbo', 'simbo']
      this.nomi_semi = ["fiori", "quadr", "cuori", "picch"]
    }
    console.log("Load cards from folder %s and type %s", folder, this.current_deck_type)
    if (this.current_deck_type === folder) {
      console.log("Avoid to load a new card deck")
      return
    }
    this.cards = []
    this.cards_rotated = []
    let folder_fullpath = "assets/carte/" + folder + "/"
    console.log("Load cards...")
    if (num_cards_onsuit === 13) {
      this.deck_information.activateThe52deck()
    } else {
      this.deck_information.setToDeck40()
    }
    for (let i = 0; i < this.nomi_semi.length; i++) {
      let seed = this.nomi_semi[i]
      for (let index = 1; index <= num_cards_onsuit; index++) {
        let ixname = `${index}`
        if (index < 10) {
          ixname = '0' + ixname
        }
        card_fname = `${folder_fullpath}${ixname}${seed}.png`
        console.log('Card fname is: ', card_fname)
      }
    }
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