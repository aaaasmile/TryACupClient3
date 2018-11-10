import { Log4Cup } from '../../shared/log4cup'

export class DeckInfoItem {
  ix: number;
  nome: string;
  symb: string;
  segno: string;
  seed_ix: number;
  pos: number;
  rank: number;
  points: number;
}

class IDeckInfo40 {
  _Ab: DeckInfoItem;
  _2b: DeckInfoItem;
  _3b: DeckInfoItem;
  _4b: DeckInfoItem;
  _5b: DeckInfoItem;
  _6b: DeckInfoItem;
  _7b: DeckInfoItem;
  _Fb: DeckInfoItem;
  _Cb: DeckInfoItem;
  _Rb: DeckInfoItem;
  _Ac: DeckInfoItem;
  _2c: DeckInfoItem;
  _3c: DeckInfoItem;
  _4c: DeckInfoItem;
  _5c: DeckInfoItem;
  _6c: DeckInfoItem;
  _7c: DeckInfoItem;
  _Fc: DeckInfoItem;
  _Cc: DeckInfoItem;
  _Rc: DeckInfoItem;
  _Ad: DeckInfoItem;
  _2d: DeckInfoItem;
  _3d: DeckInfoItem;
  _4d: DeckInfoItem;
  _5d: DeckInfoItem;
  _6d: DeckInfoItem;
  _7d: DeckInfoItem;
  _Fd: DeckInfoItem;
  _Cd: DeckInfoItem;
  _Rd: DeckInfoItem;
  _As: DeckInfoItem;
  _2s: DeckInfoItem;
  _3s: DeckInfoItem;
  _4s: DeckInfoItem;
  _5s: DeckInfoItem;
  _6s: DeckInfoItem;
  _7s: DeckInfoItem;
  _Fs: DeckInfoItem;
  _Cs: DeckInfoItem;
  _Rs: DeckInfoItem;
}

class IDeckInfo52 extends IDeckInfo40 {
  _8b: DeckInfoItem;
  _9b: DeckInfoItem;
  _db: DeckInfoItem;
  _8c: DeckInfoItem;
  _9c: DeckInfoItem;
  _dc: DeckInfoItem;
  _8d: DeckInfoItem;
  _9d: DeckInfoItem;
  _dd: DeckInfoItem;
  _8s: DeckInfoItem;
  _9s: DeckInfoItem;
  _ds: DeckInfoItem;
}

export class DeckInfo {
  private _log: Log4Cup = new Log4Cup('deck_info');

  private deck_info_det52: IDeckInfo52 = new IDeckInfo52()
  private deck_info_det: IDeckInfo40 = new IDeckInfo40()
  private use_52deck: boolean = false

  private cards_on_game: string[] = [
    '_Ab', '_2b', '_3b', '_4b', '_5b', '_6b', '_7b', '_Fb', '_Cb', '_Rb',
    '_Ac', '_2c', '_3c', '_4c', '_5c', '_6c', '_7c', '_Fc', '_Cc', '_Rc',
    '_Ad', '_2d', '_3d', '_4d', '_5d', '_6d', '_7d', '_Fd', '_Cd', '_Rd',
    '_As', '_2s', '_3s', '_4s', '_5s', '_6s', '_7s', '_Fs', '_Cs', '_Rs'];

  constructor() {
    this.setToDeck40()
  }

  setToDeck40():void {
    this.use_52deck = false
    this.deck_info_det._Ab = { ix: 0, nome: 'asso bastoni', symb: 'asso', segno: 'B', seed_ix: 0, pos: 1, points: 0, rank: 0 }
    this.deck_info_det._2b = { ix: 1, nome: 'due bastoni', symb: 'due', segno: 'B', seed_ix: 0, pos: 2, points: 0, rank: 0 }
    this.deck_info_det._3b = { ix: 2, nome: 'tre bastoni', symb: 'tre', segno: 'B', seed_ix: 0, pos: 3, points: 0, rank: 0 }
    this.deck_info_det._4b = { ix: 3, nome: 'quattro bastoni', symb: 'qua', segno: 'B', seed_ix: 0, pos: 4, points: 0, rank: 0 }
    this.deck_info_det._5b = { ix: 4, nome: 'cinque bastoni', symb: 'cin', segno: 'B', seed_ix: 0, pos: 5, points: 0, rank: 0 }
    this.deck_info_det._6b = { ix: 5, nome: 'sei bastoni', symb: 'sei', segno: 'B', seed_ix: 0, pos: 6, points: 0, rank: 0 }
    this.deck_info_det._7b = { ix: 6, nome: 'sette bastoni', symb: 'set', segno: 'B', seed_ix: 0, pos: 7, points: 0, rank: 0 }
    this.deck_info_det._Fb = { ix: 7, nome: 'fante bastoni', symb: 'fan', segno: 'B', seed_ix: 0, pos: 8, points: 0, rank: 0 }
    this.deck_info_det._Cb = { ix: 8, nome: 'cavallo bastoni', symb: 'cav', segno: 'B', seed_ix: 0, pos: 9, points: 0, rank: 0 }
    this.deck_info_det._Rb = { ix: 9, nome: 're bastoni', symb: 're', segno: 'B', seed_ix: 0, pos: 10, points: 0, rank: 0 }
    this.deck_info_det._Ac = { ix: 10, nome: 'asso coppe', symb: 'asso', segno: 'C', seed_ix: 1, pos: 1, points: 0, rank: 0 }
    this.deck_info_det._2c = { ix: 11, nome: 'due coppe', symb: 'due', segno: 'C', seed_ix: 1, pos: 2, points: 0, rank: 0 }
    this.deck_info_det._3c = { ix: 12, nome: 'tre coppe', symb: 'tre', segno: 'C', seed_ix: 1, pos: 3, points: 0, rank: 0 }
    this.deck_info_det._4c = { ix: 13, nome: 'quattro coppe', symb: 'qua', segno: 'C', seed_ix: 1, pos: 4, points: 0, rank: 0 }
    this.deck_info_det._5c = { ix: 14, nome: 'cinque coppe', symb: 'cin', segno: 'C', seed_ix: 1, pos: 5, points: 0, rank: 0 }
    this.deck_info_det._6c = { ix: 15, nome: 'sei coppe', symb: 'sei', segno: 'C', seed_ix: 1, pos: 6, points: 0, rank: 0 }
    this.deck_info_det._7c = { ix: 16, nome: 'sette coppe', symb: 'set', segno: 'C', seed_ix: 1, pos: 7, points: 0, rank: 0 }
    this.deck_info_det._Fc = { ix: 17, nome: 'fante coppe', symb: 'fan', segno: 'C', seed_ix: 1, pos: 8, points: 0, rank: 0 }
    this.deck_info_det._Cc = { ix: 18, nome: 'cavallo coppe', symb: 'cav', segno: 'C', seed_ix: 1, pos: 9, points: 0, rank: 0 }
    this.deck_info_det._Rc = { ix: 19, nome: 're coppe', symb: 're', segno: 'C', seed_ix: 1, pos: 10, points: 0, rank: 0 }
    this.deck_info_det._Ad = { ix: 20, nome: 'asso denari', symb: 'asso', segno: 'D', seed_ix: 2, pos: 1, points: 0, rank: 0 }
    this.deck_info_det._2d = { ix: 21, nome: 'due denari', symb: 'due', segno: 'D', seed_ix: 2, pos: 2, points: 0, rank: 0 }
    this.deck_info_det._3d = { ix: 22, nome: 'tre denari', symb: 'tre', segno: 'D', seed_ix: 2, pos: 3, points: 0, rank: 0 }
    this.deck_info_det._4d = { ix: 23, nome: 'quattro denari', symb: 'qua', segno: 'D', seed_ix: 2, pos: 4, points: 0, rank: 0 }
    this.deck_info_det._5d = { ix: 24, nome: 'cinque denari', symb: 'cin', segno: 'D', seed_ix: 2, pos: 5, points: 0, rank: 0 }
    this.deck_info_det._6d = { ix: 25, nome: 'sei denari', symb: 'sei', segno: 'D', seed_ix: 2, pos: 6, points: 0, rank: 0 }
    this.deck_info_det._7d = { ix: 26, nome: 'sette denari', symb: 'set', segno: 'D', seed_ix: 2, pos: 7, points: 0, rank: 0 }
    this.deck_info_det._Fd = { ix: 27, nome: 'fante denari', symb: 'fan', segno: 'D', seed_ix: 2, pos: 8, points: 0, rank: 0 }
    this.deck_info_det._Cd = { ix: 28, nome: 'cavallo denari', symb: 'cav', segno: 'D', seed_ix: 2, pos: 9, points: 0, rank: 0 }
    this.deck_info_det._Rd = { ix: 29, nome: 're denari', symb: 're', segno: 'D', seed_ix: 2, pos: 10, points: 0, rank: 0 }
    this.deck_info_det._As = { ix: 30, nome: 'asso spade', symb: 'asso', segno: 'S', seed_ix: 3, pos: 1, points: 0, rank: 0 }
    this.deck_info_det._2s = { ix: 31, nome: 'due spade', symb: 'due', segno: 'S', seed_ix: 3, pos: 2, points: 0, rank: 0 }
    this.deck_info_det._3s = { ix: 32, nome: 'tre spade', symb: 'tre', segno: 'S', seed_ix: 3, pos: 3, points: 0, rank: 0 }
    this.deck_info_det._4s = { ix: 33, nome: 'quattro spade', symb: 'qua', segno: 'S', seed_ix: 3, pos: 4, points: 0, rank: 0 }
    this.deck_info_det._5s = { ix: 34, nome: 'cinque spade', symb: 'cin', segno: 'S', seed_ix: 3, pos: 5, points: 0, rank: 0 }
    this.deck_info_det._6s = { ix: 35, nome: 'sei spade', symb: 'sei', segno: 'S', seed_ix: 3, pos: 6, points: 0, rank: 0 }
    this.deck_info_det._7s = { ix: 36, nome: 'sette spade', symb: 'set', segno: 'S', seed_ix: 3, pos: 7, points: 0, rank: 0 }
    this.deck_info_det._Fs = { ix: 37, nome: 'fante spade', symb: 'fan', segno: 'S', seed_ix: 3, pos: 8, points: 0, rank: 0 }
    this.deck_info_det._Cs = { ix: 38, nome: 'cavallo spade', symb: 'cav', segno: 'S', seed_ix: 3, pos: 9, points: 0, rank: 0 }
    this.deck_info_det._Rs = { ix: 39, nome: 're spade', symb: 're', segno: 'S', seed_ix: 3, pos: 10, points: 0, rank: 0 }
  }


  activateThe52deck() {
    this.use_52deck = true
    this.cards_on_game = [
      '_Ab', '_2b', '_3b', '_4b', '_5b', '_6b', '_7b', '_8b', '_9b', '_10b', '_Fb', '_Cb', '_Rb',
      '_Ac', '_2c', '_3c', '_4c', '_5c', '_6c', '_7c', '_8c', '_9c', '_10c', '_Fc', '_Cc', '_Rc',
      '_Ad', '_2d', '_3d', '_4d', '_5d', '_6d', '_7d', '_8d', '_9d', '_10d', '_Fd', '_Cd', '_Rd',
      '_As', '_2s', '_3s', '_4s', '_5s', '_6s', '_7s', '_8s', '_9s', '_10s', '_Fs', '_Cs', '_Rs'];

    Object.keys(this.deck_info_det).forEach(key => this.deck_info_det52[key] = key);
    // bastoni 
    this.deck_info_det52._8b = { ix: 7, nome: 'otto bastoni', symb: 'ott', segno: 'B', seed_ix: 0, pos: 8, points: 0, rank: 0 }
    this.deck_info_det52._9b = { ix: 8, nome: 'nove bastoni', symb: 'nov', segno: 'B', seed_ix: 0, pos: 9, points: 0, rank: 0 }
    this.deck_info_det52._db = { ix: 9, nome: 'dieci bastoni', symb: 'die', segno: 'B', seed_ix: 0, pos: 10, points: 0, rank: 0 }
    this.deck_info_det52._Fb = { ix: 10, nome: 'fante bastoni', symb: 'fan', segno: 'B', seed_ix: 0, pos: 11, points: 0, rank: 0 }
    this.deck_info_det52._Cb = { ix: 11, nome: 'cavallo bastoni', symb: 'cav', segno: 'B', seed_ix: 0, pos: 12, points: 0, rank: 0 }
    this.deck_info_det52._Rb = { ix: 12, nome: 're bastoni', symb: 're', segno: 'B', seed_ix: 0, pos: 13, points: 0, rank: 0 }
    //coppe
    this.deck_info_det52._Ac.ix = 13
    this.deck_info_det52._2c.ix = 14
    this.deck_info_det52._3c.ix = 15
    this.deck_info_det52._4c.ix = 16
    this.deck_info_det52._5c.ix = 17
    this.deck_info_det52._6c.ix = 18
    this.deck_info_det52._7c.ix = 19
    this.deck_info_det52._8c = { ix: 20, nome: 'otto coppe', symb: 'ott', segno: 'C', seed_ix: 1, pos: 8, points: 0, rank: 0 }
    this.deck_info_det52._9c = { ix: 21, nome: 'nove coppe', symb: 'nov', segno: 'C', seed_ix: 1, pos: 9, points: 0, rank: 0 }
    this.deck_info_det52._dc = { ix: 22, nome: 'dieci coppe', symb: 'die', segno: 'C', seed_ix: 1, pos: 10, points: 0, rank: 0 }
    this.deck_info_det52._Fc = { ix: 23, nome: 'fante coppe', symb: 'fan', segno: 'C', seed_ix: 1, pos: 11, points: 0, rank: 0 }
    this.deck_info_det52._Cc = { ix: 24, nome: 'cavallo coppe', symb: 'cav', segno: 'C', seed_ix: 1, pos: 12, points: 0, rank: 0 }
    this.deck_info_det52._Rc = { ix: 25, nome: 're coppe', symb: 're', segno: 'C', seed_ix: 1, pos: 13, points: 0, rank: 0 }
    //denari
    this.deck_info_det52._Ad.ix = 26
    this.deck_info_det52._2d.ix = 27
    this.deck_info_det52._3d.ix = 28
    this.deck_info_det52._4d.ix = 29
    this.deck_info_det52._5d.ix = 30
    this.deck_info_det52._6d.ix = 31
    this.deck_info_det52._7d.ix = 32
    this.deck_info_det52._8d = { ix: 33, nome: 'otto denari', symb: 'ott', segno: 'D', seed_ix: 2, pos: 8, points: 0, rank: 0 }
    this.deck_info_det52._9d = { ix: 34, nome: 'nove denari', symb: 'nov', segno: 'D', seed_ix: 2, pos: 9, points: 0, rank: 0 }
    this.deck_info_det52._dd = { ix: 35, nome: 'dieci denari', symb: 'die', segno: 'D', seed_ix: 2, pos: 10, points: 0, rank: 0 }
    this.deck_info_det52._Fd = { ix: 36, nome: 'fante denari', symb: 'fan', segno: 'D', seed_ix: 2, pos: 11, points: 0, rank: 0 }
    this.deck_info_det52._Cd = { ix: 37, nome: 'cavallo denari', symb: 'cav', segno: 'D', seed_ix: 2, pos: 12, points: 0, rank: 0 }
    this.deck_info_det52._Rd = { ix: 38, nome: 're denari', symb: 're', segno: 'D', seed_ix: 2, pos: 13, points: 0, rank: 0 }
    //spade
    this.deck_info_det52._As.ix = 39
    this.deck_info_det52._2s.ix = 40
    this.deck_info_det52._3s.ix = 41
    this.deck_info_det52._4s.ix = 42
    this.deck_info_det52._5s.ix = 43
    this.deck_info_det52._6s.ix = 44
    this.deck_info_det52._7s.ix = 45
    this.deck_info_det52._8s = { ix: 46, nome: 'otto spade', symb: 'ott', segno: 'S', seed_ix: 3, pos: 8, points: 0, rank: 0 }
    this.deck_info_det52._9s = { ix: 47, nome: 'nove spade', symb: 'nov', segno: 'S', seed_ix: 3, pos: 9, points: 0, rank: 0 }
    this.deck_info_det52._ds = { ix: 48, nome: 'dieci spade', symb: 'die', segno: 'S', seed_ix: 3, pos: 10, points: 0, rank: 0 }
    this.deck_info_det52._Fs = { ix: 49, nome: 'fante spade', symb: 'fan', segno: 'S', seed_ix: 3, pos: 11, points: 0, rank: 0 }
    this.deck_info_det52._Cs = { ix: 50, nome: 'cavallo spade', symb: 'cav', segno: 'S', seed_ix: 3, pos: 12, points: 0, rank: 0 }
    this.deck_info_det52._Rs = { ix: 51, nome: 're spade', symb: 're', segno: 'S', seed_ix: 3, pos: 13, points: 0, rank: 0 }
  }

  get_rank(card_lbl): number {
    if (this.use_52deck) {
      return this.deck_info_det52[card_lbl].rank;
    }
    return this.deck_info_det[card_lbl].rank;
  }

  get_points(card_lbl): number {
    if (this.use_52deck) {
      return this.deck_info_det52[card_lbl].points;
    }
    return this.deck_info_det[card_lbl].points;
  }

  get_card_info(card_lbl): DeckInfoItem {
    if (this.use_52deck) {
      return this.deck_info_det52[card_lbl];
    }
    return this.deck_info_det[card_lbl];
  }

  get_cards_on_game(): string[] {
    return this.cards_on_game;
  }

  private set_rank_points(arr_rank, arr_points): void {
    var i, symb_card;
    for (i = 0; i < this.cards_on_game.length; i++) {
      var k: string = this.cards_on_game[i];
      var card: DeckInfoItem = this.deck_info_det[k];
      if (this.use_52deck) {
        card = this.deck_info_det52[k]
      }
      if (card == null) {
        throw (new Error('Error on deck ' + k + ' not found'));
      }
      symb_card = card.symb;
      card.rank = arr_rank[symb_card];
      card.points = arr_points[symb_card];
    }
  }

  deck_info_dabriscola(): void {
    var val_arr_rank = { sei: 6, cav: 9, qua: 4, re: 10, set: 7, due: 2, cin: 5, asso: 12, fan: 8, tre: 11 };
    var val_arr_points = { sei: 0, cav: 3, qua: 0, re: 4, set: 0, due: 0, cin: 0, asso: 11, fan: 2, tre: 10 };

    this.set_rank_points(val_arr_rank, val_arr_points);
    this._log.debug('Deck briscola created');
  }

}