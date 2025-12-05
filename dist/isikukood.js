"use strict";
var Isikukood = (() => {
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
    Gender: () => Gender,
    default: () => Isikukood
  });
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
    /**
     * Algorithm to get control number.
     */
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
        if (10 === controlNum) {
          controlNum = 0;
        }
      }
      return controlNum;
    }
    /**
     * Validates the Estonian personal ID.
     */
    validate() {
      if (this.code.charAt(0) === "0" || this.code.length !== 11) {
        return false;
      }
      if (this.getControlNumber() !== Number(this.code.charAt(10))) {
        return false;
      }
      const year = Number(this.code.substring(1, 3));
      const month = Number(this.code.substring(3, 5));
      const day = Number(this.code.substring(5, 7));
      const birthDate = this.getBirthday();
      return year === birthDate.getFullYear() % 100 && birthDate.getMonth() + 1 === month && day === birthDate.getDate();
    }
    /**
     * Gets the gender of a person
     */
    getGender() {
      const genderNum = this.code.charAt(0);
      const maleDigits = ["1", "3", "5"];
      const femaleDigits = ["2", "4", "6"];
      if (maleDigits.includes(genderNum)) {
        return "male" /* MALE */;
      } else if (femaleDigits.includes(genderNum)) {
        return "female" /* FEMALE */;
      } else {
        return "unknown" /* UNKNOWN */;
      }
    }
    /**
     * Get the age of a person in years.
     */
    getAge() {
      const birthDate = this.getBirthday();
      const today = /* @__PURE__ */ new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birthDate.getDate()) {
        age--;
      }
      return age;
    }
    /**
     *  Get the birthday of a person.
     */
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
    /**
     * Parses the code and return it's data as object.
     */
    parse() {
      return Isikukood.parse(this.code);
    }
    static parse(code) {
      const ik = new this(code);
      const data = {
        gender: ik.getGender(),
        birthDay: ik.getBirthday(),
        age: ik.getAge()
      };
      return data;
    }
    /**
     *  Validates the Estonian personal ID.
     *  In params argument months are beginning from 1, not from 0.
     *  If code cannot be generated empty string is returned.
     *  1 - January
     *  2 - February
     *  3 - March
     *  etc.
     */
    static generate(params = {}) {
      let y;
      let m;
      let d;
      const gender = params.gender || (Math.round(Math.random()) === 0 ? "male" /* MALE */ : "female" /* FEMALE */);
      let personalId = "";
      const hospitals = [
        "00",
        // Kuressaare Haigla (järjekorranumbrid 001 kuni 020)
        "01",
        // Tartu Ülikooli Naistekliinik, Tartumaa, Tartu (011...019)
        "02",
        // Ida-Tallinna Keskhaigla, Hiiumaa, Keila, Rapla haigla (021...220)
        "22",
        // Ida-Viru Keskhaigla (Kohtla-Järve, endine Jõhvi) (221...270)
        "27",
        // Maarjamõisa Kliinikum (Tartu), Jõgeva Haigla (271...370)
        "37",
        // Narva Haigla (371...420)
        "42",
        // Pärnu Haigla (421...470)
        "47",
        // Pelgulinna Sünnitusmaja (Tallinn), Haapsalu haigla (471...490)
        "49",
        // Järvamaa Haigla (Paide) (491...520)
        "52",
        // Rakvere, Tapa haigla (521...570)
        "57",
        // Valga Haigla (571...600)
        "60",
        // Viljandi Haigla (601...650)
        "65",
        // Lõuna-Eesti Haigla (Võru), Pälva Haigla (651...710?)
        "70",
        // All other hospitals
        "95"
        // Foreigners who are born in Estonia
      ];
      if (!["male" /* MALE */, "female" /* FEMALE */].includes(gender)) {
        return "";
      }
      if (params.birthYear) {
        y = params.birthYear;
      } else {
        y = Math.round(
          Math.random() * 100 + 1900 + ((/* @__PURE__ */ new Date()).getFullYear() - 2e3)
        );
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
            case "male" /* MALE */:
              personalId += String(j - 1);
              break;
            case "female" /* FEMALE */:
              personalId += String(j);
              break;
            default:
              return "";
          }
        }
      }
      personalId += String(y).substring(2, 4);
      personalId += String(m).padStart(2, "0");
      personalId += String(d).padStart(2, "0");
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
  return __toCommonJS(isikukood_exports);
})();
window.Isikukood=Isikukood.default;
