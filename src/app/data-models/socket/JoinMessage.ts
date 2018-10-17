import { Message, MessageType } from './SocketMessages'

export class JoinMessage implements Message {
  cmd: string;
  type: string;
  pin: string;
  index: number;
  user: string;
  ok: boolean;

  parseDetailsJoinOK(cmd_details: string) {
    this.index = parseInt(cmd_details, 10);
    this.ok = true;
  }

  isOk(): boolean {
    return this.ok;
  }

  msgType(): MessageType {
    return MessageType.Join;
  }

  toString(): string {
    return this.cmd + ':' + this.type + ' ' + this.index + ' ' + this.user;
  }
}