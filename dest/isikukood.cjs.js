var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var isikukood_exports = {};
__export(isikukood_exports, {
  Isikukood: () => Isikukood
});
module.exports = __toCommonJS(isikukood_exports);
class Isikukood {
  constructor(c) {
    this.code = c;
  }
  get code() {
    return this._code;
  }
  set code(c) {
    this._code = String(c);
  }
  getControlNumber(code) {
    if (!code) {
      code = this.code;
    }
    const multiplier1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
    const multiplier2 = [3, 4, 5, 6, 7, 8, 9, 1, 2, 3];
    let mod = 0;
    let total = 0;
    for (let i = 0; i < 10; ++i) {
      total += code.charAt(i) * multiplier1[i];
    }
    mod = total % 11;
    total = 0;
    if (mod === 10) {
      for (let i = 0; i < 10; ++i) {
        total += code.charAt(i) * multiplier2[i];
      }
      mod = total % 11;
      if (mod === 10) {
        mod = 0;
      }
    }
    return mod;
  }
  validate() {
    if (this.code.charAt(0) === "0") {
      return false;
    }
    if (this.code.length !== 11) {
      return false;
    }
    const control = this.getControlNumber();
    if (control !== parseInt(this.code.charAt(10))) {
      return false;
    }
    const year = Number(this.code.substring(1, 3));
    const month = Number(this.code.substring(3, 5));
    const day = Number(this.code.substring(5, 7));
    const birthDate = this.getBirthday();
    return year === birthDate.getFullYear() % 100 && birthDate.getMonth() + 1 === month && day === birthDate.getDate();
  }
  getGender() {
    const firstNumber = this.code.charAt(0);
    let retval = "";
    switch (firstNumber) {
      case "1":
      case "3":
      case "5":
        retval = "male";
        break;
      case "2":
      case "4":
      case "6":
        retval = "female";
        break;
      default:
        retval = "unknown";
    }
    return retval;
  }
  getAge() {
    return Math.floor((new Date().getTime() - this.getBirthday().getTime()) / (86400 * 1e3) / 365.25);
  }
  getBirthday() {
    let year = parseInt(this.code.substring(1, 3));
    const month = parseInt(this.code.substring(3, 5).replace(/^0/, "")) - 1;
    const day = this.code.substring(5, 7).replace(/^0/, "");
    const firstNumber = this.code.charAt(0);
    if (firstNumber === "1" || firstNumber === "2") {
      year += 1800;
    } else if (firstNumber === "3" || firstNumber === "4") {
      year += 1900;
    } else if (firstNumber === "5" || firstNumber === "6") {
      year += 2e3;
    } else if (firstNumber === "7" || firstNumber === "8") {
      year += 2100;
    }
    return new Date(year, month, day);
  }
  parse(code) {
    if (!code) {
      code = this.code;
    }
    return {
      gender: this.getGender(),
      birthDay: this.getBirthday(),
      age: this.getAge()
    };
  }
  static generate(params = {}) {
    let y;
    let m;
    let d;
    let gender = params.gender || Math.round(Math.random()) === 0 ? "male" : "female";
    let personalId = "";
    const hospitals = [
      "00",
      "01",
      "02",
      "22",
      "27",
      "37",
      "42",
      "47",
      "49",
      "52",
      "57",
      "60",
      "65",
      "70",
      "95"
    ];
    if (!(gender === "female" || gender === "male")) {
      return "";
    }
    if (params.birthYear) {
      y = params.birthYear;
    } else {
      y = Math.round(Math.random() * 100 + 1900 + (new Date().getFullYear() - 2e3));
    }
    if (params.birthMonth) {
      m = params.birthMonth;
    } else {
      m = Math.floor(Math.random() * 12) + 1;
    }
    if (params.birthDay) {
      d = params.birthDay;
    } else {
      var daysInMonth = new Date(y, m, 0).getDate();
      d = Math.floor(Math.random() * daysInMonth) + 1;
    }
    if (gender === "male" && y >= 1800 && y <= 1899) {
      personalId += "1";
    } else if (gender === "female" && y >= 1800 && y <= 1899) {
      personalId += "2";
    } else if (gender === "male" && y >= 1900 && y <= 1999) {
      personalId += "3";
    } else if (gender === "female" && y >= 1900 && y <= 1999) {
      personalId += "4";
    } else if (gender === "male" && y >= 2e3 && y <= 2099) {
      personalId += "5";
    } else if (gender === "female" && y >= 2e3 && y <= 2099) {
      personalId += "6";
    } else if (gender === "male" && y >= 2100 && y <= 2199) {
      personalId += "7";
    } else if (gender === "female" && y >= 2100 && y <= 2199) {
      personalId += "8";
    } else {
      return "";
    }
    personalId += String(y).substring(2, 4);
    personalId += String(m).length === 1 ? "0" + m : m;
    personalId += String(d).length === 1 ? "0" + d : d;
    personalId += hospitals[Math.floor(Math.random() * hospitals.length)];
    personalId += Math.floor(Math.random() * 10);
    personalId += this.prototype.getControlNumber(personalId);
    return personalId;
  }
}
