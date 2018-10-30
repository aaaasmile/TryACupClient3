import { Message, MessageType } from './SocketMessages'

export class GameStatusMessage implements Message {
  cmd: string;
  status: string;
  game_status: any;
  
  parseDetails(cmd_details: string) {
    let payload = JSON.parse(cmd_details);
    this.status = payload.status
    this.game_status = payload.game_state;
  }

  msgType(): MessageType {
    return MessageType.GameStatus;
  }

  is_status_requested(){
    return this.status === "requested"
  }

  toString(): string {
    return this.cmd + ':' + this.status;
  }
}