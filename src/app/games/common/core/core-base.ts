import { Log4Cup } from '../../../shared/log4cup'
import * as Rx from 'rxjs/Rx'

//-------------------INTERFACES ---------------------------

export interface ICore {
  process_next(): number;
  get_subject_state_action();
  submit_next_state(name: string): void;
  clear_gevent(): void;
  fire_all(event_name: string, args_payload: {}): void;
  fire_to_player(player: string, event_name: string, args_payload: {}): void;
}

export interface ICoreActor {
  suspend_proc_gevents(str: string): void;
  continue_process_events(str: string): void;
  submit_action(action_name: string, act_args: any[]): void;
  get_subject_for_all_players();
  get_subject_for_player(player: string);
}

//----------------------------------------------

export class MatchInfo {
  match_state: CoreStateEnum;
  score = [];
  end_reason = '';
  winner_name = '';

  start(): void {
    this.match_state = CoreStateEnum.Started;
    this.score = [];
    this.end_reason = '';
    this.winner_name = '';
  }
}

// ----    CoreDataSupport  ----------

export class CoreDataSupport {
  private _log: Log4Cup = new Log4Cup('CoreDataSupport');

  segni_curr_match = { score: {}, segno_state: CoreStateEnum.Undef };
  match_state: CoreStateEnum;
  match_info: MatchInfo = new MatchInfo();
  players: string[] = [];
  carte_prese = {};
  carte_in_mano = {};
  carte_gioc_mano_corr: Object[] = [];
  history_mano = [];
  mano_count: number = 0;
  first_player_ix: number = 0;
  round_players: string[] = [];
  points_curr_segno = {};
  mazzo_gioco = [];
  num_of_cards_onhandplayer = 3;
  player_on_turn: string = null;
  // var _carte_gioc_mano_corr = []

  start(num_of_players: number, players: string[], hand_player_size: number): void {
    this.match_state = CoreStateEnum.Started;
    this.match_info.start();
    this.players = [];
    if (hand_player_size === undefined) {
      throw (new Error('hand_player_size is undefined'));
    }

    this.num_of_cards_onhandplayer = hand_player_size;
    for (let i = 0; i < num_of_players; i++) {
      let player = players[i];
      this.players.push(player);
      this.segni_curr_match.score[player] = 0;
    }
  }

  start_new_giocata(first_ix: number, cards: string[]): void {
    this.segni_curr_match.segno_state = CoreStateEnum.Started;
    this.carte_prese = {};
    this.carte_in_mano = {};
    this.carte_gioc_mano_corr = [];
    this.history_mano = [];
    this.mano_count = 0;
    this.first_player_ix = first_ix;
    this.round_players = this.calc_round_players(first_ix);
    this._log.debug('First player to play is ' + this.round_players[0] + ' with index ' + this.first_player_ix);
    this._log.debug('Number of round_players is ' + this.round_players.length + ' players size is ' + this.players.length);
    for (let i = 0; i < this.round_players.length; i++) {
      let player = this.round_players[i];
      this._log.debug('On this game play the player: ' + this.round_players[i]);
      this.points_curr_segno[player] = 0;
      this.carte_prese[player] = [];
      this.carte_in_mano[player] = [];
    }
    this.mazzo_gioco = cards;
    this._log.info('Current deck: ' + this.mazzo_gioco.join(','));
  }

  switch_player_on_turn(): string {
    this.player_on_turn = this.round_players.length > 0 ? this.round_players[0] : null;
    return this.player_on_turn;
  }

  private calc_round_players(first_ix: number): string[] {
    var ins_point = -1, round_players = [], onlast = true;
    for (let i = 0; i < this.players.length; i++) {
      if (i === first_ix) {
        ins_point = 0;
        onlast = false;
      }
      if (ins_point === -1) {
        round_players.push(this.players[i]);
      }
      else {
        round_players.splice(ins_point, 0, this.players[i]);
      }
      ins_point = onlast ? -1 : ins_point + 1;
    }
    return round_players;
  }
}

export enum CoreStateEnum {
  Undef,
  Started,
  Finished
}

// ----    CoreStateEventBase  ----------

export class CoreStateEventBase implements ICore, ICoreActor {
  private _processor: StateActionProcessor;
  private _alg_action: CoreQueue;
  private _core_state: CoreQueue;
  private _subStateAction = new Rx.Subject();
  private event_for_all = new Rx.Subject();
  private event_for_player = {};

  // _env: 'develop', 'production'
  constructor(private _env: string) { // TODO: prova a vedere se riesci ad usare dei workflows, esempio standalone va subito allo start.
    let that = this;

    this._alg_action = new CoreQueue("alg-action", that);
    this._core_state = new CoreQueue("core-state", that);
    this._processor = new StateActionProcessor(
      this._alg_action,
      this._core_state,
      _env);
  }

  // ICore
  process_next(): number { return this._processor.process_next(); }

  get_subject_state_action() {
    return this._subStateAction;
  }

  submit_next_state(name_st: string): void {
    let that = this;
    this._core_state.submit(function (args) {
      that._subStateAction.next(args)
    }, { is_action: false, name: name_st, args_arr: [] });
  }

  fire_all(event_name: string, args_payload: {}): void {
    this.event_for_all.next({ event: event_name, args: args_payload });
  }

  fire_to_player(player: string, event_name: string, args_payload: {}): void {
    this.get_subject_for_player(player).next({ event: event_name, args: args_payload });
  }

  clear_gevent(): void {
    this._processor.clear();
  }

  // IActorHandler
  suspend_proc_gevents(str: string): void { this._processor.suspend_proc_gevents(str); }
  continue_process_events(str: string): void { this._processor.continue_process_events(str); }

  submit_action(action_name: string, act_args: any[]): void {
    let that = this;
    this._alg_action.submit(function (args) {
      that._subStateAction.next(args)
    }, { is_action: true, name: action_name, args_arr: act_args })
  }

  get_subject_for_all_players() {
    return this.event_for_all;
  }

  get_subject_for_player(player) {
    if (this.event_for_player[player] == null) {
      this.event_for_player[player] = new Rx.Subject();
    }
    return this.event_for_player[player];
  }

  // other
  process_all(): void {
    let numRemProc = 1
    while (numRemProc > 0) {
      numRemProc = this._processor.process_next();
    }
  }
}

// ----------- CoreSubjectNtfy ---
export class SubjectNtfy {
  protected _subscription;
  constructor(protected _processor, protected opt) { }

  process_next(event: string, name_hand: string, args): void {
    if (this._processor[name_hand] != null) {
      //console.log(args,args instanceof Array);
      if (!(args instanceof Array)) {
        args = [args];
      }
      this._processor[name_hand].apply(this._processor, args);
    } else if (this.opt.log_missed || this.opt.log_all) {
      console.log("%s ignored because handler %s is missed", event, name_hand);
    }
  }

  dispose(): void {
    if (this._subscription != null) {
      this._subscription.unsubscribe();
      this._subscription = null;
    }
  }
}

export class CoreSubjectNtfy extends SubjectNtfy {

  constructor(private _core: ICore, protected _processor, opt?) {
    super(_processor, opt || { log_missed: false, log_all: false });
    this._subscription = _core.get_subject_state_action().subscribe(next => {
      try {
        if (opt.log_all) { console.log(next); }
        let name_hand = next.name;
        if (next.is_action) {
          name_hand = 'act_' + name_hand;
        }
        this.process_next(next.name, name_hand, next.args_arr);
      } catch (e) {
        console.error(e);
      }

    });
  }
}

export class CoreGameBase {
  private _internal_state: string;
  protected _log: Log4Cup = new Log4Cup('CoreGameBase');

  protected set_state(state_name: string) {
    this._log.debug(state_name); 
    this._internal_state = state_name; 
  }

  protected check_state(state_name: string) {
    if (this._internal_state !== state_name) {
      throw (new Error('Event expected in state ' + state_name + ' but now is ' + this._internal_state));
    }
  }
}

// -- Private section --

class StateActionProcessor {
  private _suspend_queue_proc: boolean = false;
  private _num_of_suspend: number;
  private _log: Log4Cup = new Log4Cup('StateActionProcessor');

  constructor(private _action_queued: CoreQueue,
    private _proc_queue: CoreQueue,
    private _env: string) { }

  get_action_queue(): CoreQueue { return this._action_queued; }
  get_proc_queue(): CoreQueue { return this._proc_queue; }

  suspend_proc_gevents(str: string): void {
    this._suspend_queue_proc = true;
    this._num_of_suspend += 1;
    this._log.debug('suspend_proc_gevents (' + str + ' add lock ' + this._num_of_suspend + ')');
  }

  clear(): void {
    this._action_queued.clear();
    this._proc_queue.clear();
    this._num_of_suspend = 0;
  }

  continue_process_events(str1: string): void {
    var str = str1 || '--';
    if (this._num_of_suspend <= 0) { return; }

    this._num_of_suspend -= 1;
    if (this._num_of_suspend <= 0) {
      this._num_of_suspend = 0;
      this._suspend_queue_proc = false;
      this._log.debug('Continue to process core events (' + str + ')');
      this.process_next();
    } else {
      this._log.debug('Suspend still locked (locks: ' + this._num_of_suspend + ') (' + str + ')');
    }
  }

  process_next(): number {
    //this._proc_queue.log_state();
    //this._action_queued.log_state();
    if (this._suspend_queue_proc) {
      return 0;
    }
    while (this._proc_queue.has_items() && !this._suspend_queue_proc) {
      this._proc_queue.process_first();
    }
    if (this._suspend_queue_proc) {
      return 0;
    }
    if (this._action_queued.has_items()) {
      try {
        this._action_queued.process_first();
      } catch (e) {
        if (this._env === 'develop') {
          throw (new Error(e));
        } else {
          this._log.warn('Action ignored beacuse: ' + e);
        }
      }
    }
    if (this._suspend_queue_proc) {
      return 0;
    }
    //this._proc_queue.log_state();
    //this._action_queued.log_state();

    return this._proc_queue.size() + this._action_queued.size();
  }
}

class CoreQueue {
  private registry = [];
  private _log: Log4Cup = new Log4Cup('CoreQueue');

  constructor(private queue_name: string, private executer) { }


  submit(func, args): void {
    if (func == null) { throw (new Error('Handler is null')); }
    this.registry.push({ func: func, parameters: [args] });
    //_log.debug("Item submitted, queue size: " + registry.length + ' on ' + queue_name);
  }

  process_first(): void {
    //_log.debug('item process START, queue size: ' + registry.length + ' on ' + queue_name)
    if (this.registry.length == 0) {
      return;
    }
    var funinfo = this.registry.shift();
    try {
      funinfo.func.apply(this.executer, funinfo.parameters);
    } catch (e) {
      this._log.err('Error on executing action handler process_first \nparam ' + JSON.stringify(funinfo.parameters) + '\nError: ' + e + '\n Stack: ' + e.stack);
      throw (e);
    }
    //_log.debug('item process END, queue size: ' + registry.length + ' on ' + queue_name)
  }

  has_items(): boolean {
    return this.registry.length > 0 ? true : false;
  }

  size(): number {
    return this.registry.length;
  }

  log_state(): void {
    this._log.debug('queue: ' + this.queue_name + ' with items ' + this.registry.length);
  }

  clear(): void {
    this.registry = [];
  }

}
