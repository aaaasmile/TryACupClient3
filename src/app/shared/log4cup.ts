export class Log4Cup {
  constructor(private _name_type: string) { }

  debug(msg: string): void {
    console.log("[DBG]" + "[" + this._name_type + "]" + msg);
  }

  warn(msg: string): void {
    console.log("[WRN]" + "[" + this._name_type + "]" + msg);
  }

  info(msg: string): void {
    console.log("[INFO]" + "[" + this._name_type + "]" + msg);
  }

  err(msg: string): void {
    console.log("[ERR]" + "[" + this._name_type + "]" + msg);
  }

  change_nametype(newname: string): void {
    console.log("Change type from [%s] to the new [%s]", this._name_type, newname);
    this._name_type = newname;
  }
}

export class Helper {
  static MinOnWeightItem1(w_cards: Object[]) {
    // expects something like this:
    // let w_cards = [
    //   ['ab', 2],
    //   ['fs', 1],
    //   ['rs', 4],
    //   ['rc', 12]
    // ];
    // and returns ['fs', 1]
    let min_ele = Math.min.apply(Math, w_cards.map(function (o) {
      return o[1];
    }));
    let min_obj = w_cards.filter(function (o) { return o[1] === min_ele; })[0];
    return min_obj;
  }
}