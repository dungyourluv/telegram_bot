const moment = require("moment-timezone");

class Time {
  static #id = 1;
  constructor(title, hour, minute, second) {
    this.title = title;
    this.hours = hour;
    this.minutes = minute;
    this.second = second || 0;
    Time.#id += 1;
  }
  getTimeDay() {
    const now = moment.tz(Date.now(), "Asia/Saigon");
    const date = moment.tz(
      new Date(now.year(), now.month(), now.date(), this.hours, this.minutes, this.second, 0),
      "Asia/Saigon"
    );
    return date.valueOf();
  }
  getText() {
    return this.hours + " giờ " + this.minutes + " phút ";
  }
  static getTimeNow() {
    const now = moment.tz(Date.now(), "Asia/Saigon");
    return now;
  }
  static getTimeTextNow() {
    const now = this.getTimeNow();
    return now.hour() + "h" + now.minute() + "m" + now.second() + "s";
  }
  static lefTime(time) {
    const now = this.getTimeNow().valueOf();
    if (now > time) {
      return {
        status: false,
        time: {},
      };
    }
    const left = Math.floor((time - now) / 1000);
    const hour = Math.floor(left / 3600);
    const minute = Math.floor((left % 3600) / 60);
    const second = Math.floor((left % 360) % 60);
    return {
      status: true,
      time: {
        hour,
        minute,
        second,
      },
    };
  }
}

module.exports = Time;
