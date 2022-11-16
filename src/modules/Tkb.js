const axios = require("axios");
const { JSDOM } = require("jsdom");
const Time = require("../other/Time");
class Tkb {
  static timeList = [
    new Time("Tiết 1", 7, 30),
    new Time("Tiết 2", 8, 30),
    new Time("Tiết 3", 9, 30),
    new Time("Tiết 4", 10, 30),
    new Time("Tiết 5", 11, 30),
    new Time("Tiết 6", 13, 0),
    new Time("Tiết 7", 14, 0),
    new Time("Tiết 8", 15, 0),
    new Time("Tiết 9", 16, 0),
    new Time("Tiết 10", 17, 0),
  ];
  #cookie;
  constructor(cookie) {
    this.#cookie = cookie;
  }
  async getAll(week) {
    try {
      const { data } = await axios.get("https://daotao.vku.udn.vn/sv/tkb", {
        headers: {
          Cookie: this.#cookie,
        },
        params: {
          tuan: week,
        },
      });
      const arr = [];
      const document = new JSDOM(data).window.document;
      const table = document.querySelector("table");
      const thead = table.querySelector("thead");
      const tbody = table.querySelector("tbody");
      const title = document.querySelector(".x_title h2").textContent;
      thead
        .querySelector("tr")
        .querySelectorAll("th")
        .forEach((item, index) => {
          if (index == 0) return;
          arr.push({
            id: index,
            day: item.querySelector("div").innerHTML.replace("<br>", " ngày "),
            today: title.replace("Thời khóa biểu  - ", ""),
            item: [],
          });
        });
      tbody.querySelectorAll("tr").forEach((item, index) => {
        const td = item.querySelectorAll("td");
        td.forEach((tdItem, tdIndex) => {
          if (tdIndex == 0) return;
          if (tdItem.textContent.length != 0) {
            arr[tdIndex - 1].item.push({
              name: tdItem.querySelector("h2").textContent,
              className: tdItem.textContent.replace(tdItem.querySelector("h2").textContent, ""),
              rows: tdItem.getAttribute("rowspan") || 1,
              id: index + 1,
              time: Tkb.timeList[index],
              start: Tkb.timeList[index].getText(),
              timeStamp: Tkb.timeList[index].getTimeDay(),
              isLesson: tdItem.textContent.length != 0,
            });
          }
        });
      });
      return {
        status: true,
        data: arr,
      };
    } catch (e) {
      return {
        status: false,
        title: "Có lỗi trong quá trình lấy dữ liệu",
        err: e,
        data: [],
      };
    }
  }
  async getNow() {
    let dayNow = Time.getTimeNow().day();
    if (dayNow == 0) dayNow = 7;
    dayNow = dayNow - 1;
    return await this.getDay(dayNow);
  }
  async getDay(day) {
    if (day < 0 || day > 7 || !Number.isInteger(day)) {
      return {
        status: false,
        title: "Thứ từ 0 --> 6 ( Thứ 2 --> Chủ  nhật )",
      };
    }
    const tkbOfWeek = await this.getAll();
    if (tkbOfWeek.status) {
      const tkbDay = tkbOfWeek.data[day];
      return {
        status: true,
        data: tkbDay,
        arrTextLesson: tkbDay.item.map((obj) => this.#getText(obj)),
      };
    } else {
      return tkbOfWeek;
    }
  }
  #getText(o = {}) {
    // const { status, time } = Time.lefTime(o.timeStamp);
    return `- Môn: ${o.name}\n` + `- Phòng: ${o.className}\n` + `- Số tiết: ${o.rows}\n` + `- Bắt đầu lúc: ${o.start}`;
  }
}

module.exports = Tkb;
