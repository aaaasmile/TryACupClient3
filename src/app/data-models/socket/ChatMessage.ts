import { Message, MessageType } from './SocketMessages'

export class ChatMessage implements Message{
  cmd: string;
  type: string;
  username: string;
  datetime: Date;
  time: string;
  date: string;
  body: string;
  /* Esempio di messaggio in json
  {
    "username":"aaaasmile","body":"hi","time":"2018-10-16 21:23:31 +0200"
  }*/
  parseCmdDetails(cmd_details: string) {
    let payload = JSON.parse(cmd_details);
    this.body = payload.body
    this.username = payload.username
    let d1 = new Date(Date.parse(payload.time))
    let mm = d1.getMonth() + 1
    let mms = mm.toString()
    if (mm < 10){
      mms = '0' + mm.toString()
    }
    let day = d1.getDate()
    let days = day.toString()
    if(day < 10){
      days = '0' + day.toString()
    }
    let yys = d1.getFullYear().toString()
    this.time = this.padToZeroStr(d1.getHours()) + ':' + this.padToZeroStr(d1.getMinutes());
    this.date = days + '/' + mms + '/' + yys
    this.datetime = d1
    console.log('Parse chat details at: ', this.date, this.time)
  }

  padToZeroStr(num: number): string{
    if(num < 10){
      return '0' + num.toString()
    }
    return num.toString()
  }

  msgType(): MessageType {
    return MessageType.Chat;
  }

  toString(): string {
    return this.cmd + ':' + this.type + ' ' + this.body;
  }
}