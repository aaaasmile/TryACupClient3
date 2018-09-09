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
  constructor(isok: boolean) {
    this.is_ok = isok;
  }

  msgType(): MessageType {
    return MessageType.User;
  }

  toString(): string {
    return this.cmd + '-> is_ok: ' + this.is_ok.toString() + ' user ' + JSON.stringify(this.user);
  }
}