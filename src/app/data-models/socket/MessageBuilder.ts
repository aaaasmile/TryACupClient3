import { Message, InfoMessage, VerMessage } from './SocketMessages'
import { UserMessage, User } from './UserMessage'
import { List2Message } from './List2Message'


export class MessageBuilder {

  static parse(srv_message: string): Message {
    let arr_cmd_msg = srv_message.split(":");
    let cmd = arr_cmd_msg[0];
    // details of command
    arr_cmd_msg = arr_cmd_msg.slice(1, arr_cmd_msg.length);
    let cmd_details = arr_cmd_msg.join(":");
    //retreive the symbol of the command handler
    var result: Message = null;
    switch (cmd) {
      case 'INFO':
        {
          let msg = new InfoMessage();
          msg.cmd = cmd;
          msg.info = cmd_details;
          result = msg;
          break;
        }
      case 'VER':
        {
          let msg = new VerMessage();
          msg.cmd = cmd;
          msg.parseDetails(cmd_details);
          result = msg;
          break;
        }
      case 'LOGINERROR':
        {
          let msg = new UserMessage(false);
          let det = JSON.parse(cmd_details);
          msg.cmd = cmd;
          msg.info = det.info;
          msg.error_code = det.code;
          result = msg;
          break;
        }
      case 'LOGINOK':
        {
          let msg = new UserMessage(true);
          let det = JSON.parse(cmd_details);
          msg.cmd = cmd;
          msg.user = new User();
          msg.user.login = det.name;
          msg.user.token = det.token;
          result = msg;
          break;
        }
      case 'USEREXISTRESULT':
        {
          let msg = new UserMessage(true);
          let det = JSON.parse(cmd_details);
          msg.cmd = cmd;
          msg.is_ok = det.exists;
          if (det.exists == true) {
            msg.user = new User();
            msg.user.login = det.login;
          }
          result = msg;
          break;
        }
      case 'USEROPRESULT':
        {
          //{"login":null,"is_ok":false,"code":1,"info":"Impossibile inserire l'utente"}
          let msg = new UserMessage(true);
          let det = JSON.parse(cmd_details);
          msg.cmd = cmd;
          msg.is_ok = det.is_ok;
          msg.info = det.info;
          if (det.is_ok == true) {
            msg.user = new User();
            msg.user.login = det.login;
          }
          result = msg;
          break;
        }
      case 'LIST2':
        {
          let msg = new List2Message();
          msg.cmd = cmd;

          msg.parseCmdDetails(cmd_details);
          result = msg;
          break;
        }
      default:
        console.warn('Parseframe: ignore message ' + srv_message);
        break;
    }

    return result;
  }
}
