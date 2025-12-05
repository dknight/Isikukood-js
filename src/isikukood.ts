/**
 * Validates and generates Estonian personal ID. Also has some useful API
 * to work with personal id.
 *
 * Isikukood (Personal ID in Estonian).
 * Estonian Standard EVS 585:2007
 * https://www.evs.ee/et/evs-585-2007
 * https://et.wikipedia.org/wiki/Isikukood
 * https://github.com/dknight/Isikukood-js/
 *
 * @author Dmitri Smirnov
 * @copyright 2014-2025
 *
 * The License (MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */
export default class Isikukood {
  private _code: string;
  constructor(c: string | number) {
    this._code = String(c);
  }

  get code(): string {
    return this._code;
  }
  set code(c: string | number) {
    this._code = String(c);
  }

  /**
   * Algorithm to get control number.
   */
  getControlNumber(code = ""): number {
    if (!code) {
      code = this.code;
    }
    const mul1: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
    const mul2: number[] = [3, 4, 5, 6, 7, 8, 9, 1, 2, 3];
    let controlNum: number = 0;
    let total: number = 0;

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
  validate(): boolean {
    if (this.code.charAt(0) === "0" || this.code.length !== 11) {
      return false;
    }
    if (this.getControlNumber() !== Number(this.code.charAt(10))) {
      return false;
    }

    const year: number = Number(this.code.substring(1, 3));
    const month: number = Number(this.code.substring(3, 5));
    const day: number = Number(this.code.substring(5, 7));
    const birthDate: Date = this.getBirthday();
    return (
      year === birthDate.getFullYear() % 100 &&
      birthDate.getMonth() + 1 === month &&
      day === birthDate.getDate()
    );
  }

  /**
   * Gets the gender of a person
   */
  getGender(): Gender {
    const genderNum = this.code.charAt(0);
    const maleDigits = ["1", "3", "5"];
    const femaleDigits = ["2", "4", "6"];
    if (maleDigits.includes(genderNum)) {
      return Gender.MALE;
    } else if (femaleDigits.includes(genderNum)) {
      return Gender.FEMALE;
    } else {
      return Gender.UNKNOWN;
    }
  }

  /**
   * Get the age of a person in years.
   */
  getAge(): number {
    const birthDate = this.getBirthday();
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  /**
   *  Get the birthday of a person.
   */
  getBirthday(): Date {
    let year: number = Number(this.code.substring(1, 3));
    const month: number =
      Number(this.code.substring(3, 5).replace(/^0/, "")) - 1;
    const day: number = Number(this.code.substring(5, 7).replace(/^0/, ""));
    const firstNumber: string = this.code.charAt(0);

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
  parse(): PersonalData {
    return Isikukood.parse(this.code);
  }

  static parse(code: string | number): PersonalData {
    const ik: Isikukood = new this(code);
    const data: PersonalData = {
      gender: ik.getGender(),
      birthDay: ik.getBirthday(),
      age: ik.getAge(),
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
  static generate(params: GenerateInput = {}): string {
    let y: number;
    let m: number;
    let d: number;
    const gender =
      params.gender ||
      (Math.round(Math.random()) === 0 ? Gender.MALE : Gender.FEMALE);
    let personalId: string = "";

    // Places of brith (Estonian Hospitals)
    const hospitals: string[] = [
      "00", // Kuressaare Haigla (järjekorranumbrid 001 kuni 020)
      "01", // Tartu Ülikooli Naistekliinik, Tartumaa, Tartu (011...019)
      "02", // Ida-Tallinna Keskhaigla, Hiiumaa, Keila, Rapla haigla (021...220)
      "22", // Ida-Viru Keskhaigla (Kohtla-Järve, endine Jõhvi) (221...270)
      "27", // Maarjamõisa Kliinikum (Tartu), Jõgeva Haigla (271...370)
      "37", // Narva Haigla (371...420)
      "42", // Pärnu Haigla (421...470)
      "47", // Pelgulinna Sünnitusmaja (Tallinn), Haapsalu haigla (471...490)
      "49", // Järvamaa Haigla (Paide) (491...520)
      "52", // Rakvere, Tapa haigla (521...570)
      "57", // Valga Haigla (571...600)
      "60", // Viljandi Haigla (601...650)
      "65", // Lõuna-Eesti Haigla (Võru), Pälva Haigla (651...710?)
      "70", // All other hospitals
      "95", // Foreigners who are born in Estonia
    ];

    if (![Gender.MALE, Gender.FEMALE].includes(gender)) {
      return "";
    }

    if (params.birthYear) {
      y = params.birthYear;
    } else {
      y = Math.round(
        Math.random() * 100 + 1900 + (new Date().getFullYear() - 2000)
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
      const daysInMonth: number = new Date(y, m, 0).getDate();
      d = Math.floor(Math.random() * daysInMonth) + 1;
    }

    // Set the gender
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

    // Set the year
    personalId += String(y).substring(2, 4);

    // Set the month
    personalId += String(m).padStart(2, "0");

    // Set the day
    personalId += String(d).padStart(2, "0");

    // Set the hospital
    personalId += hospitals[Math.floor(Math.random() * hospitals.length)];

    // Set the number of birth
    personalId += String(Math.floor(Math.random() * 10));

    // Set the control number
    personalId += String(this.prototype.getControlNumber(personalId));

    return personalId;
  }
}

export interface PersonalData {
  gender: Gender;
  birthDay: Date;
  age: number;
}

export interface GenerateInput {
  gender?: Gender;
  birthYear?: number;
  birthMonth?: number;
  birthDay?: number;
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  UNKNOWN = "unknown",
}
