import { InGameMessage } from "./socket/InGameMessage";
import { ChatMessage } from "./socket/ChatMessage";

export class TableBuffer {
  TableIx: string
  GameName: string
  BufferInGameMsg: InGameMessage[] = new Array<InGameMessage>()
  BufferChatMsg: ChatMessage[] = new Array<ChatMessage>()
  PlayerNames: string[] = new Array<string>()
}
