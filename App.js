const Config = require("./src/Config");
const Bot = require("./src/Bot");
const Tkb = require("./src/modules/Tkb");
class App {
  constructor() {}

  async start() {
    const bot = new Bot(Config.token, Config.prefix);
    bot.onBot();
  }
}

const app = new App();
app.start();
