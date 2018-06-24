import { ICoreActor, SubjectNtfy } from './core-base'

export interface IPlayer {
  Name: string;
  Position: number;
}

// ----------- Player -------------
export class Player implements IPlayer {
  public Name: string = "Utente" + this.getUserId();
  public Position: number = 0;

  constructor(name: string) {
    if (name != null) { this.Name = name; }
  }

  private getUserId(): string {
    return String(Math.random() * 999);
  }
}

// ----------- PlayerActor -------------
export class PlayerActor {
  public Player: Player
  constructor(pl: Player, private _coreActor: ICoreActor) {
    this.Player = pl;
  }

  sit_down(pos: number): void {
    this._coreActor.submit_action('player_sit_down', [this.Player.Name, pos]);
  }

  play_card(card: string): void {
    this._coreActor.submit_action('alg_play_acard', [this.Player.Name, card])
  }

  getCore(): ICoreActor { return this._coreActor; }
}

// ----------- ActorSubjectNtfy -------------
export class ActorSubjectNtfy extends SubjectNtfy {
  private _playerSubject;

  constructor(private _core: ICoreActor, protected _processor, opt?) {
    super(_processor, opt || { log_missed: false, log_all: false });
    this._subscription = _core.get_subject_for_all_players().subscribe(next => {
      try {
        if (opt.log_all) { console.log(next); }
        let name_hand = 'on_all_' + next.event;
        this.process_next(next.event, name_hand, next.args);
      } catch (e) {
        console.error(e);
      }
    });
  }

  subscribePlayer(player_name: string) {
    this._playerSubject = this._core.get_subject_for_player(player_name).subscribe(next => {
      try {
        if (this.opt.log_all) { console.log(next); }
        let name_hand = 'on_pl_' + next.event;
        this.process_next(next.event, name_hand, next.args);
      } catch (e) {
        console.error(e);
      }
    });
  }

  dispose(): void {
    if (this._playerSubject != null) {
      this._playerSubject.unsubscribe();
      this._playerSubject = null;
    }
    super.dispose();
  }
}
