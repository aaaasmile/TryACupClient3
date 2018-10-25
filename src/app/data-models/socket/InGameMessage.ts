import { Message, MessageType } from './SocketMessages'

export enum OnGameType {
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

  constructor(cmd_details: string, name: string) {
    this.name = name
    this.cmd_details = cmd_details
  }

  getOnGameType(): OnGameType {
    switch (name) {
      case 'ONALGNEWMATCH':
        return OnGameType.NewMatch
      case 'ONALGNEWGIOCATA':
        return OnGameType.NewGiocata
      case 'ONALGNEWMANO':
        return OnGameType.NewMano
      case 'ONALGHAVETOPLAY':
        return OnGameType.HaveToPlay
      default:
        console.warn('OnGame name as type not recognized ', name);
        break;
    }
  }

  msgType(): MessageType {
    return MessageType.OnGame;
  }

  toString(): string {
    return this.cmd + ' ' + this.cmd_details
  }
}