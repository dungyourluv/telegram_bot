const Tkb = require("../modules/Tkb");
const Config = require("../Config");
const Time = require("../other/Time");
class TkbOn {
  #handle;
  static config = {
    name: "tkb",
    permision: 0,
  };
  constructor() {
    const tkb = new Tkb(Config.myCookieVku);
    this.#handle = tkb;
  }
  async run({ bot, args, msg }) {
    const data = await this.#handle.getNow();
    console.log(data);
    if (data.status) {
      bot.sendMessage(
        msg.chat.id,
        `----------Thời khoá biểu----------\n` +
          data.arrTextLesson.join("\n--------------------\n") +
          `\n--------------------\n` +
          "- " +
          data.data.today +
          `\n- Bây giờ là: ${Time.getTimeTextNow()}`
      );
    } else {
      bot.sendMessage(msg.chat.id, data.err.message);
    }
  }
  event() {}
  reply() {}
}

module.exports = TkbOn;
