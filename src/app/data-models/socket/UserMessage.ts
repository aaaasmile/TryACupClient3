import { Message, MessageType } from './SocketMessages'

export class User {
  id: number;
  full_name: string;
  login: string;
  email: string;
  token: string;
}

export class UserMessage implements Message {
  cmd: string;
  info: string;
  user: User;
  is_ok: boolean;
  error_code: number;
  constructor() {
    this.is_ok = true;
  }

  msgType(): MessageType {
    return MessageType.User;
  }

  toString(): string {
    return this.cmd + '-> is_ok: ' + this.is_ok.toString() + ' user ' + JSON.stringify(this.user);
  }
}

export class UserLoginFailed extends UserMessage {
  constructor(cmd: string, cmd_details: string) {
    super();
    this.is_ok = false;
    let det = JSON.parse(cmd_details);
    this.cmd = cmd;
    this.info = det.info;
    this.error_code = det.code;
  }
}

export class UserLoginOk extends UserMessage {
  constructor(cmd: string, cmd_details: string) {
    super();
    let det = JSON.parse(cmd_details);
    this.cmd = cmd;
    this.user = new User();
    this.user.login = det.name;
    this.user.token = det.token;
  }
}

export class UserLogoutOk extends UserMessage {
  constructor(cmd: string, cmd_details: string) {
    super();
    let det = JSON.parse(cmd_details);
    this.cmd = cmd;
    this.is_ok = true;
    this.user = new User();
    this.user.login = det.name;
  }
}

export class UserOperationResult extends UserMessage {
  constructor(cmd: string, cmd_details: string) {
    super();
    let det = JSON.parse(cmd_details); 
    // In caso di errore:
    //{"login":null,"is_ok":false,"code":1,"info":"Impossibile inserire l'utente"}
    // In caso ok:
    //{"login":"luzzo14","is_ok":true,"code":0,"info":"Utente creato con successo"}
    this.cmd = cmd;
    this.is_ok = det.is_ok;
    this.info = det.info;
    console.log("User operation: ", det);
    if (det.is_ok === true) {
      this.user = new User();
      this.user.login = det.login;
    }
  }
}

export class UserExistResult extends UserMessage {
  constructor(cmd: string, cmd_details: string) {
    super();
    let det = JSON.parse(cmd_details);
    this.cmd = cmd;
    this.is_ok = det.exists;
    if (det.exists === true) {
      this.user = new User();
      this.user.login = det.name;
    }
  }
}

export class UserSignupReq {
  login: string; 
  password: string; 
  email: string;
  gender: string; 
  fullname: string; 
  deckname: string;
  token_captcha: string;
}
