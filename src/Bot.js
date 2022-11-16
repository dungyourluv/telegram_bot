const Config = require("./Config");
const ManagerCmd = require("./ManagerCmd");
const Telegram = require("node-telegram-bot-api");
class Bot {
  #token;
  #prefix;
  #allCommand;
  constructor(token = Config.token, prefix = Config.prefix) {
    this.#token = token;
    this.#prefix = prefix;
    const manager = new ManagerCmd();
    this.#allCommand = manager.getAllCmd();
  }

  getCmd(text = "") {
    const args = text.split(/ +/);
    const prefixs = args.shift();
    const cmdname = prefixs.slice(this.#prefix.length);
    const cmd = this.#allCommand.get(cmdname);
    if (cmd) {
      return {
        status: true,
        cmd: cmd,
        args,
      };
    } else {
      return {
        status: false,
        cmd: {},
        args,
      };
    }
  }

  onBot() {
    const bot = new Telegram(this.#token, { polling: true });
    bot.on("message", (msg, math) => {
      try {
        const { status, cmd, args } = this.getCmd(msg.text);
        if (status) {
          cmd.run({ bot, args, msg });
        }
      } catch (e) {
        console.log(e);
      }
    });
  }
}

module.exports = Bot;
