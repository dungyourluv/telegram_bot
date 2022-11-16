const fs = require("fs");
const { join } = require("path");
class ManagerCmd {
  #allCmd;
  constructor() {
    this.#allCmd = new Map();
    this.loadCmd();
  }
  loadCmd() {
    const listScript = fs.readdirSync(join(__dirname, "./scripts")).filter((item) => item.endsWith(".js"));
    console.log(listScript);
    let temp;
    for (let script of listScript) {
      temp = require(join(__dirname, "./scripts/" + script));
      this.#allCmd.set(temp.config.name, new temp());
    }
  }
  getAllCmd() {
    return this.#allCmd;
  }
}

module.exports = ManagerCmd;
