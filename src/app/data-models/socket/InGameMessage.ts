import { Message, MessageType } from './SocketMessages'

export enum InGameMsgType {
  NewMatch,
  NewGiocata,
  NewMano,
  HaveToPlay
}

export class InGameMessage implements Message {
  cmd: string;
  type: string;
  name: string
  cmd_details: string
  table_id: string;
  public Payload: any = {};
  public inGameMsgType: InGameMsgType

  constructor(cmd_details: string, cmd: string) {
    this.cmd = cmd
    this.cmd_details = cmd_details
    switch (cmd) {
      case 'ONALGNEWMATCH':
        this.inGameMsgType = InGameMsgType.NewMatch
        this.Payload = JSON.parse(cmd_details);
        break
      case 'ONALGNEWGIOCATA':
        this.inGameMsgType = InGameMsgType.NewGiocata
        break
      case 'ONALGNEWMANO':
        this.inGameMsgType = InGameMsgType.NewMano
        break
      case 'ONALGHAVETOPLAY':
        this.inGameMsgType = InGameMsgType.HaveToPlay
        break
      default:
        console.warn('OnGame name as type not recognized ', cmd);
        break;
    }
    
    this.table_id = "1"
  }

  msgType(): MessageType {
    return MessageType.InGame;
  }

  toString(): string {
    return this.cmd + ' ' + this.cmd_details
  }
}