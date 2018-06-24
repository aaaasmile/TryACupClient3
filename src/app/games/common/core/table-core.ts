import { ICore, CoreSubjectNtfy } from './core-base'
import { Log4Cup } from '../../../shared/log4cup'
import { Subject } from 'rxjs';

export class TableStateCore {
  private _log: Log4Cup = new Log4Cup('TableStateCore');
  private _currNumPlayers: number;
  TableFullSub = new Subject();
  private _players: string[] = [];
  private _notifyer: CoreSubjectNtfy;

  constructor(private _core: ICore, private _numOfPlayers: number) {
    let that = this;
    this._notifyer = new CoreSubjectNtfy(_core, that, { log_missed: false });
    this._currNumPlayers = 0;
    _core.submit_next_state('st_waiting_for_players');
  }

  st_waiting_for_players(): void {
    this._log.debug('Waiting for players');
  }

  st_table_partial(): void {
    this._log.debug('Table is filling');
  }

  st_table_full(): void {
    this._log.debug("Table is full with " + this._currNumPlayers + " players: " + this._players.join(','));
    this.TableFullSub.next({ players: this._players })
  }

  act_player_sit_down(name: string, pos: number) {
    this._log.debug("Player " + name + " sit on pos " + pos);
    this._currNumPlayers += 1;
    while (this._players.length < pos) {
      this._players.push('');
    }
    this._players[pos] = name;
    if (this._currNumPlayers >= this._numOfPlayers) {
      this._currNumPlayers = this._numOfPlayers;
      this._core.submit_next_state('st_table_full');
    } else {
      this._core.submit_next_state('st_table_partial');
    }
  }

  dispose(): void {
    if (this._notifyer != null) {
      this._notifyer.dispose();
      this._notifyer = null;
    }
  }

}