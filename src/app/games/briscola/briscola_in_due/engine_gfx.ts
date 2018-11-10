import { DeckInfo } from "../../common/deck-info";

export class EngineGfx {
  deck_france: boolean
  nomi_simboli = ["basto", "coppe", "denar", "spade"]
  nomi_semi = ["cope", "zero", "xxxx", "vuot"]
  current_deck_type = ''
  cards = []
  cards_rotated = []
  deck_information = new DeckInfo();

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
    if (num_cards_onsuit === 13){
      this.deck_information.deck_info_dabriscola()
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