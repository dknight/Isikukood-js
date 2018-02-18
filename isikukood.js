(function(root) {
  /**
   *  Validates and generates Estonian personal ID. Also has some useful utilities to work with personal id.
   *  ISIKUKOOD (Personal ID in Estonian).
   *
   *  Read more about isikukood http://et.wikipedia.org/wiki/Isikukood
   *  Docs: https://github.com/dknight/Isikukood-js/
   *
   * @author Dmitri Smirnov
   * @copyright 2014-2018
   *
   * The MIT License (MIT)
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
  function Isikukood(code) {

    'use strict';

    this.code = code;

    /**
     *  Gets the control number of personal ID.
     *
     *  @return number
     */
    this.getControlNumber = function () {
      var multiplier1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1],
        multiplier2 = [3, 4, 5, 6, 7, 8, 9, 1, 2, 3],
        mod,
        total = 0;

      for (var i = 0; i < 10; i++) {
        total += this.code.charAt(i) * multiplier1[i];
      }
      mod = total % 11;

      total = 0;
      if (10 === mod) {
        for (i = 0; i < 10; i++) {
          total += this.code.charAt(i) * multiplier2[i];
        }
        mod = total % 11;
        if (10 === mod) {
          mod = 0;
        }
      }
      return mod;
    };

    /**
     *  Validates the Estonian personal ID.
     *
     *  @return boolean
     */
    this.validate = function () {
      if (this.code.length !== 11) {
        return false;
      }
      var control = this.getControlNumber(code);
      if (control !== parseInt(this.code.charAt(10))) {
        return false;
      }
      
      var year = Number(this.code.substr(1, 2));
      var month = Number(this.code.substr(3, 2));
      var day = Number(this.code.substr(5, 2));
      var birthDate = this.getBirthday();
      return year === birthDate.getFullYear() % 100 && birthDate.getMonth() + 1 === month && day === birthDate.getDate();
    };

    /**
     *  Gets the gender of a person
     *
     *  @return string
     */
    this.getGender = function () {
      var firstNumber = this.code.charAt(0),
        retval = '';
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
    };

    /**
     *  Get the age of a person in years.
     *
     *  @return number
     */
    this.getAge = function () {
      return Math.floor((new Date().getTime() - this.getBirthday().getTime()) / (86400 * 1000) / 365.25);
    };

    /**
     *  Get the birthday of a person.
     *
     *  @return Date
     */
    this.getBirthday = function () {
      var year = parseInt(this.code.substring(1, 3)),
        month = parseInt(this.code.substring(3, 5).replace(/^0/, '')) - 1,
        day = this.code.substring(5, 7).replace(/^0/, ''),
        firstNumber = this.code.charAt(0);

      if (firstNumber === '1' || firstNumber === '2') {
        year += 1800;
      } else if (firstNumber === '3' || firstNumber === '4') {
        year += 1900;
      } else if (firstNumber === '5' || firstNumber === '6') {
        year += 2000;
      } else {
        year += 2100;
      }

      return new Date(year, month, day);
    };
  }

  /**
   *  Validates the Estonian personal ID.
   *  In params argument months are beginning from 1. 1 - January, 2 - February etc.
   *
   *  @access public static
   *  @param params {object}
   *  @return string
   */
  Isikukood.generate = function (params) {

    'use strict';

    params = params || {};

    var y, m, d,
      gender = params.gender || ((Math.round(Math.random()) === 0 ) ? 'male' : 'female'),
      personalId = '',

      // Places of brith (Estonian Hospitals)
      hospitals = [
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
      throw new IsikukoodException('gender param accepts only "male" or "female" values.');
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
    } else if (gender === 'male' && y >= 2000) {
      personalId += '5';
    } else if (gender === 'female' && y >= 2000) {
      personalId += '6';
    }

    // Set the year
    personalId += parseInt(y, 0).toString().substring(2, 4);

    // Set the month
    personalId += m.toString().length === 1 ? '0' + m : m;

    // Set the day
    personalId += d.toString().length === 1 ? '0' + d : d;

    // Set the hospital
    personalId += hospitals[Math.floor(Math.random() * hospitals.length)];

    // Set the number of birth
    personalId += Math.floor(Math.random() * 10);

    // Set the control number
    personalId += new Isikukood(personalId).getControlNumber();

    return personalId;
  };

  /**
   *  Isikukood exception.
   *
   *  @author Dmitri Smirnov
   *  @copyright 2014-2018
   */
  function IsikukoodException(err) {
    throw new Error(err);
  }

  // Make it available for browsers and node
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Isikukood;
  } else {
    root.Isikukood = Isikukood;
  }
})(this);
