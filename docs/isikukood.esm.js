"use strict";
class Isikukood {
  constructor(c) {
    this._code = String(c);
  }
  get code() {
    return this._code;
  }
  set code(c) {
    this._code = String(c);
  }
  getControlNumber(code = "") {
    if (!code) {
      code = this.code;
    }
    const mul1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
    const mul2 = [3, 4, 5, 6, 7, 8, 9, 1, 2, 3];
    let controlNum = 0;
    let total = 0;
    for (let i = 0; i < 10; ++i) {
      total += Number(code.charAt(i)) * mul1[i];
    }
    controlNum = total % 11;
    total = 0;
    if (controlNum === 10) {
      for (let i = 0; i < 10; ++i) {
        total += Number(code.charAt(i)) * mul2[i];
      }
      controlNum = total % 11;
      if (controlNum === 10) {
        controlNum = 0;
      }
    }
    return controlNum;
  }
  validate() {
    if (this.code.charAt(0) === "0") {
      return false;
    }
    if (this.code.length !== 11) {
      return false;
    }
    const control = this.getControlNumber();
    if (control !== Number(this.code.charAt(10))) {
      return false;
    }
    const year = Number(this.code.substring(1, 3));
    const month = Number(this.code.substring(3, 5));
    const day = Number(this.code.substring(5, 7));
    const birthDate = this.getBirthday();
    return year === birthDate.getFullYear() % 100 && birthDate.getMonth() + 1 === month && day === birthDate.getDate();
  }
  getGender() {
    const genderNum = this.code.charAt(0);
    let retval;
    switch (genderNum) {
      case "1":
      case "3":
      case "5":
        retval = Gender.MALE;
        break;
      case "2":
      case "4":
      case "6":
        retval = Gender.FEMALE;
        break;
      default:
        retval = Gender.UNKNOWN;
    }
    return retval;
  }
  getAge() {
    return Math.floor((Date.now() - this.getBirthday().getTime()) / (86400 * 1e3) / 365.25);
  }
  getBirthday() {
    let year = Number(this.code.substring(1, 3));
    const month = Number(this.code.substring(3, 5).replace(/^0/, "")) - 1;
    const day = Number(this.code.substring(5, 7).replace(/^0/, ""));
    const firstNumber = this.code.charAt(0);
    for (let i = 1, j = 1800; i <= 8; i += 2, j += 100) {
      if ([i, i + 1].map(String).includes(firstNumber)) {
        year += j;
      }
    }
    return new Date(year, month, day);
  }
  parse(code = "") {
    if (!code) {
      code = this.code;
    }
    const data = {
      gender: this.getGender(),
      birthDay: this.getBirthday(),
      age: this.getAge()
    };
    return data;
  }
  static generate(params = {}) {
    let y;
    let m;
    let d;
    const gender = params.gender || (Math.round(Math.random()) === 0 ? Gender.MALE : Gender.FEMALE);
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
    if (![Gender.MALE, Gender.FEMALE].includes(gender)) {
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
      const daysInMonth = new Date(y, m, 0).getDate();
      d = Math.floor(Math.random() * daysInMonth) + 1;
    }
    for (let i = 1800, j = 2; i <= 2100; i += 100, j += 2) {
      if (y >= i && y < i + 100) {
        switch (gender) {
          case Gender.MALE:
            personalId += String(j - 1);
            break;
          case Gender.FEMALE:
            personalId += String(j);
            break;
          default:
            return "";
        }
      }
    }
    personalId += String(y).substring(2, 4);
    personalId += String(m).length === 1 ? `0${m}` : `${m}`;
    personalId += String(d).length === 1 ? `0${d}` : `${d}`;
    personalId += hospitals[Math.floor(Math.random() * hospitals.length)];
    personalId += String(Math.floor(Math.random() * 10));
    personalId += String(this.prototype.getControlNumber(personalId));
    return personalId;
  }
}
var Gender = /* @__PURE__ */ ((Gender2) => {
  Gender2["MALE"] = "male";
  Gender2["FEMALE"] = "female";
  Gender2["UNKNOWN"] = "unknown";
  return Gender2;
})(Gender || {});
export {
  Gender,
  Isikukood as default
};
