export enum MessageType {
  Info,
  Ver,
  User,
  List2
}
export interface Message {
  msgType(): MessageType;
  toString(): string;
}

export class VerMessage implements Message {
  cmd: string;
  MajorVer: number;
  MinVer: number;

  parseDetails(details: string): void {
    let vers = details.split(".");
    this.MajorVer = parseInt(vers[0], 10);
    this.MinVer = parseInt(vers[1], 10);
  }

  msgType(): MessageType {
    return MessageType.Ver;
  }

  toString(): string {
    return this.cmd + ':' + this.MajorVer.toString() + '.' + this.MinVer.toString();
  }
}

export class InfoMessage implements Message {
  cmd: string;
  info: string;

  msgType(): MessageType {
    return MessageType.Info;
  }

  toString(): string {
    return this.cmd + ':' + this.info;
  }
}



