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
 * @copyright 2014-2022
 * @class
 * @alias Isikukood
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
export class Isikukood {
  /**
   * @param {string|number} code
   */
  constructor(c) {
    this.code = c;
  }

  /**
   * @public
   * @return {string}
   */
  get code() {
    return this._code;
  }

  /**
   * @param {string} c
   */
  set code(c) {
    this._code = String(c);
  }

  /**
   * Gets the control number of personal ID.
   * @param {string} [code]
   * @return {number}
   */
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
      if (10 === mod) {
        mod = 0;
      }
    }
    return mod;
  }


  /**
   * Validates the Estonian personal ID.
   * @return {boolean}
   */
  validate() {
    if (this.code.charAt(0) === '0') {
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
    return year === birthDate.getFullYear() % 100
      && birthDate.getMonth() + 1 === month
      && day === birthDate.getDate();
  }

  /**
   * Gets the gender of a person
   * @return {string}
   */
  getGender() {
    const firstNumber = this.code.charAt(0);
    let retval = '';
    switch (firstNumber) {
    case '1':
    case '3':
    case '5':
      retval = 'male';
      break;
    case '2':
    case '4':
    case '6':
      retval = 'female';
      break;
    default:
      retval = 'unknown';
    }
    return retval;
  }

  /**
   * Get the age of a person in years.
   * @return {number}
   */
  getAge() {
    return Math.floor((new Date().getTime()
        - this.getBirthday().getTime()) / (86400 * 1000) / 365.25);
  }

  /**
   *  Get the birthday of a person.
   *  @return {Date}
   */
  getBirthday() {
    let year = parseInt(this.code.substring(1, 3));
    const month = parseInt(this.code.substring(3, 5).replace(/^0/, '')) - 1;
    const  day = this.code.substring(5, 7).replace(/^0/, '');
    const firstNumber = this.code.charAt(0);

    if (firstNumber === '1' || firstNumber === '2') {
      year += 1800;
    } else if (firstNumber === '3' || firstNumber === '4') {
      year += 1900;
    } else if (firstNumber === '5' || firstNumber === '6') {
      year += 2000;
    } else if (firstNumber === '7' || firstNumber === '8') {
      year += 2100;
    }

    return new Date(year, month, day);
  }

  /**
   * Parses the code and return it's data.
   * @param {string|number} [code]
   * @return {PersonalData}
   */
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

  /**
   *  Validates the Estonian personal ID.
   *  In params argument months are beginning from 1, not from 0.
   *  If code cannot be generated empty string is returned.
   *  1 - January
   *  2 - February
   *  3 - March
   *  etc.
   *  @param {object} [params={}] 
   *  @return {string}
   */
  static generate(params={}) {
    let y;
    let m;
    let d;
    let gender = params.gender || (Math.round(Math.random()) === 0)
      ? 'male'
      : 'female';
    let personalId = '';

    // Places of brith (Estonian Hospitals)
    const  hospitals = [
      '00', // Kuressaare Haigla (järjekorranumbrid 001 kuni 020)
      '01', // Tartu Ülikooli Naistekliinik, Tartumaa, Tartu (011...019)
      '02', // Ida-Tallinna Keskhaigla, Hiiumaa, Keila, Rapla haigla (021...220)
      '22', // Ida-Viru Keskhaigla (Kohtla-Järve, endine Jõhvi) (221...270)
      '27', // Maarjamõisa Kliinikum (Tartu), Jõgeva Haigla (271...370)
      '37', // Narva Haigla (371...420)
      '42', // Pärnu Haigla (421...470)
      '47', // Pelgulinna Sünnitusmaja (Tallinn), Haapsalu haigla (471...490)
      '49', // Järvamaa Haigla (Paide) (491...520)
      '52', // Rakvere, Tapa haigla (521...570)
      '57', // Valga Haigla (571...600)
      '60', // Viljandi Haigla (601...650)
      '65', // Lõuna-Eesti Haigla (Võru), Pälva Haigla (651...710?)
      '70', // All other hospitals
      '95'  // Foreigners who are born in Estonia
    ];

    if (!(gender === 'female' || gender === 'male')) {
      return '';
    }

    if (params.birthYear) {
      y = params.birthYear;
    } else {
      y = Math.round(Math.random() * 100 + 1900 + (new Date().getFullYear() - 2000));
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

    // Set the gender
    if (gender === 'male' && y >= 1800 && y <= 1899) {
      personalId += '1';
    } else if (gender === 'female' && y >= 1800 && y <= 1899) {
      personalId += '2';
    } else if (gender === 'male' && y >= 1900 && y <= 1999) {
      personalId += '3';
    } else if (gender === 'female' && y >= 1900 && y <= 1999) {
      personalId += '4';
    } else if (gender === 'male' && y >= 2000 && y <= 2099) {
      personalId += '5';
    } else if (gender === 'female' && y >= 2000 && y <= 2099) {
      personalId += '6';
    } else if (gender === 'male' && y >= 2100 && y <= 2199) {
      personalId += '7';
    } else if (gender === 'female' && y >= 2100 && y <= 2199) {
      personalId += '8';
    } else {
      return '';
    }

    // Set the year
    personalId += String(y).substring(2, 4);

    // Set the month
    personalId += String(m).length === 1 ? '0' + m : m;

    // Set the day
    personalId += String(d).length === 1 ? '0' + d : d;

    // Set the hospital
    personalId += hospitals[Math.floor(Math.random() * hospitals.length)];

    // Set the number of birth
    personalId += Math.floor(Math.random() * 10);

    // Set the control number
    personalId += this.prototype.getControlNumber(personalId);

    return personalId;
  }
} // end of class

/**
 * @typedef PersonalData
 * @property {string} gender
 * @property {Date} birthday
 * @property {number} age
 */
