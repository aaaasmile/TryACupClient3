import { Log4Cup } from '../../../shared/log4cup'
import { ICore, CoreSubjectNtfy, CoreGameBase, CoreStateEnum, MatchInfo, CoreDataSupport } from '../../common/core/core-base'
import { DeckInfo } from '../../common/deck-info'


export class CoreBriscolaBase extends CoreGameBase {
  protected _log: Log4Cup = new Log4Cup('BriscolaBaseCore');
  private _myOpt = {
    tot_num_players: 2, num_segni_match: 2
    , target_points_segno: 61, players: [], num_cards_onhand: 3
    , predef_deck: []
  };
  private _deck_info: DeckInfo = new DeckInfo();
  private _core_data = new CoreDataSupport();
  private _briscola_in_tav_lbl: string = '';

  constructor(private _core: ICore, private _numOfSegni: number, private _pointsForWin: number) {
    super();
    let that = this;
    let notifyer = new CoreSubjectNtfy(_core, that, { log_missed: true });
    this._deck_info.deck_info_dabriscola();
  }

  StartNewMatch(options): void {
    this._log.debug("Start a new match");
    this._myOpt = options || {}
    this._myOpt.predef_deck || [];
    this._myOpt.tot_num_players = this._myOpt.tot_num_players || 2;
    this._myOpt.num_segni_match = this._myOpt.num_segni_match || this._numOfSegni;
    this._myOpt.target_points_segno = this._myOpt.target_points_segno || this._pointsForWin;
    this._myOpt.num_cards_onhand = this._myOpt.num_cards_onhand || 3;
    // var _game_core_recorder = mod_gamerepl.game_core_recorder_ctor();
    // _rnd_mgr.set_predef_deck(this._myOpt.predef_deck);

    this._core_data.start(this._myOpt.tot_num_players, this._myOpt.players, this._myOpt.num_cards_onhand);
    this._core.fire_all('ev_new_match', {
      players: this._core_data.players
      , num_segni: this._myOpt.num_segni_match, target_segno: this._myOpt.target_points_segno
    });
    this._core.submit_next_state('st_new_giocata');
  }

  protected act_player_sit_down(name: string, pos: number) { }

  protected act_alg_play_acard(player_name: string, lbl_card: string) {
    this.check_state('st_wait_for_play');
    this._log.debug('Player ' + player_name + ' played ' + lbl_card);
    if (this._core_data.player_on_turn !== player_name) {
      this._log.warn('Player ' + player_name + ' not allowed to play now');
      return;
    }
    let cards: string[] = this._core_data.carte_in_mano[player_name];
    let pos = cards.indexOf(lbl_card);
    let data_card_gioc = { player_name: player_name, card_played: lbl_card };
    if (pos !== -1) {
      //_game_core_recorder.store_player_action(player.name, 'cardplayed', player.name, lbl_card);
      var old_size = this._core_data.carte_in_mano[player_name].length;
      this._core_data.carte_in_mano[player_name].splice(pos, 1);
      this._log.info('++' + this._core_data.mano_count + ',' + this._core_data.carte_gioc_mano_corr.length +
        ',Card ' + lbl_card + ' played from player ' + player_name);
      this._core_data.carte_gioc_mano_corr.push({ lbl_card: lbl_card, player: player_name });
      this._core.fire_all('ev_player_has_played', { cards_played: data_card_gioc });
      this._core_data.round_players.splice(0, 1);
      //_log.debug('_carte_in_mano ' + player_name + ' size is ' + this._core_data.carte_in_mano[player.name].length + ' _round_players size is ' + this._core_data.round_players.length);
      //_log.debug('*** new size is ' + this._core_data.carte_in_mano[player.name].length + ' old size is ' + old_size);
      this._core.submit_next_state('st_continua_mano');
    } else {
      this._log.warn('Card ' + lbl_card + ' not allowed to be played from player ' + player_name);
      this._core.fire_to_player(player_name, 'ev_player_cardnot_allowed', { hand_player: cards, wrong_card: lbl_card });
    }
  }

  protected st_new_giocata(): void {
    this.set_state('st_new_giocata');
    let cards = this._deck_info.get_cards_on_game().slice();
    //let first_player_ix = _rnd_mgr.get_first_player(_players.length);
    // cards =_rnd_mgr.get_deck(cards);
    let first_player_ix = 1;
    this._core_data.start_new_giocata(first_player_ix, cards);
    this.distribute_cards();
    this._core_data.players.forEach(player => {
      let data_newgioc = {
        carte: this._core_data.carte_in_mano[player]
        , brisc: this._briscola_in_tav_lbl
      };
      this._core.fire_to_player(player, 'ev_brisc_new_giocata', data_newgioc);
    });

    this._core.submit_next_state('st_new_mano');
  }

  protected st_new_mano(): void {
    this.set_state('st_new_giocata');
    this._core.fire_all('ev_new_mano', { mano_count: this._core_data.mano_count });
    this._core.submit_next_state('st_continua_mano');
  }

  protected st_continua_mano(): void {
    this.set_state('st_continua_mano');
    let player = this._core_data.switch_player_on_turn();
    if (player) {
      this._log.debug('Player on turn: ' + player);
      this._core.fire_all('ev_have_to_play', { player_on_turn: player });
      this._core.submit_next_state('st_wait_for_play');
    } else {
      this._core.submit_next_state('st_mano_end');
    }
  }

  protected st_wait_for_play(): void {
    this.set_state('st_wait_for_play');
  }

  protected st_mano_end(): void {
    this.set_state('st_mano_end');
  }

  private distribute_cards(): void {
    for (let i = 0; i < this._core_data.round_players.length; i++) {
      let player = this._core_data.round_players[i];
      let carte_player = [];
      for (let j = 0; j < this._core_data.num_of_cards_onhandplayer; j++) {
        carte_player.push(this._core_data.mazzo_gioco.pop());
      }
      this._core_data.carte_in_mano[player] = carte_player;
      this._core_data.carte_prese[player] = [];
      this._core_data.points_curr_segno[player] = 0;
      //console.log(this._core_data.carte_in_mano,carte_player,this._core_data.num_of_cards_onhandplayer);
    }
    this._briscola_in_tav_lbl = this._core_data.mazzo_gioco.pop();
  }
}