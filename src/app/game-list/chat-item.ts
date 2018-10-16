import { ChatMessage } from '../data-models/socket/ChatMessage'

export class ChatItem {
  username: string
  body: string
  datetime: string
  constructor(cm: ChatMessage) {
    this.username = cm.username
    this.body = cm.body
    this.datetime = cm.time
  }
}