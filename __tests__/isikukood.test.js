const Isikukood = require('../dest/isikukood.cjs.js').Isikukood;

/**
 *  Isikukood test suite.
 *
 *  @author Jaak Ritso
 *  @author Dmitri Smirnov
 *  
 *  @2015-2022
 */
'use strict';

describe('Generated Isikukood', () => {
  const generatedIK = Isikukood.generate();
  const ik = new Isikukood(generatedIK);
  it('should validate', () => {
    expect(ik.validate()).toBe(true);
  });
  it('should return birthday', () => {
    expect(ik.getBirthday()).toBeDefined();
    expect(ik.getBirthday()).toBeTruthy();
  });
  it('should return age', () => {
    expect(ik.getAge()).toBeDefined();
    expect(ik.getAge()).toBeTruthy();
    expect(ik.getAge() >= 0).toBe(true);
  });
  it('should return gender', () => {
    expect(ik.getGender()).toBeDefined();
    expect(ik.getGender()).toBeTruthy();
  });
  it('should have correct controlNumber', () => {
    const lastNumber = parseInt(generatedIK[10]);
    expect(ik.getControlNumber()).toBeDefined();
    expect(ik.getControlNumber()).toEqual(lastNumber);
  });
  it('should have correct day in range of 01 to 31 (#7)', () => {
    for (let i = 0; i < 200; i++) {
      expect(Isikukood.generate().substring(5, 7)).not.toBe('00');
    }
  });
  describe('generated Isikukood (#7)', () => {
    Array(200)
    .fill(null)
    .map((_) => Isikukood.generate())
    .forEach(code => {
      it(code + ' should be valid', () => {
        let ik = new Isikukood(code);
        expect(ik.validate()).toBe(true);
      });
    });
  });

  describe('It should generate female code (#28)', () => {
    Array(200)
    .fill(null)
        .map((_) => Isikukood.generate({
          gender: Isikukood.GENDER.FEMALE
        }))
    .forEach(code => {
      it('should be female code', () => {
        let ik = new Isikukood(code);
        expect(ik.getGender()).toBe(Isikukood.GENDER.FEMALE);
      });
    });
  });

  describe('It should generate male code (#28)', () => {
    Array(200)
    .fill(null)
        .map((_) => Isikukood.generate({
          gender: Isikukood.GENDER.MALE
        }))
    .forEach(code => {
      it('should be female code', () => {
        let ik = new Isikukood(code);
        expect(ik.getGender()).toBe(Isikukood.GENDER.MALE);
      });
    });
  });
});

describe('Isikukood 35703150220', () => {
  const ik = new Isikukood('35703150220');
  it('should validate', () => {
    expect(ik.validate()).toBe(true);
  });
  it('should return male as a gender', () => {
    expect(ik.getGender()).toBe(Isikukood.GENDER.MALE);
  });
  it('should return age correctly', () => {
    const correct_bd = new Date(1957, 2, 15);
    expect(ik.getAge()).toBe(getAge(correct_bd));
    expect(ik.getAge() >= 0).toBe(true);
  });
  it('should return birthday as 15.03.1957', () => {
    const correct_bd = new Date(1957, 2, 15);
    expect(ik.getBirthday()).toEqual(correct_bd);
  });
  it('should not return birthday as 01.03.1957', () => {
    const wrong_bd = new Date(1957, 2, 1);
    expect(ik.getBirthday()).not.toEqual(wrong_bd);
  });
  it('should have controlNumber 0', () => {
    expect(ik.getControlNumber()).toEqual(0);
  });
});

describe('Isikukood 48709172756', () => {
  const ik = new Isikukood('48709172756');
  it('should not validate', () => {
    expect(ik.validate()).toBe(false);
  });
  it('should return female as a gender', () => {
    expect(ik.getGender()).toBe(Isikukood.GENDER.FEMALE);
  });
  it('should return correct age', () => {
    var correct_bd = new Date(1987, 8, 17);
    expect(ik.getAge()).toBe(getAge(correct_bd));
    expect(ik.getAge() >= 0).toBe(true);
  });
  it('should have controlNumber 6', () => {
    expect(ik.getControlNumber()).not.toEqual(6);
  });
});

describe('Isikukood 49200186017', () => {
  const ik = new Isikukood('49200186017');
  it('should not validate', () => {
    expect(ik.validate()).toBe(false);
  });
});

describe('Isikukood 60311213742 (#5)', () => {
  const ik = new Isikukood('60311213742');
  it('should validate', () => {
    expect(ik.validate()).toBe(true);
  });
});

describe('Isikukood as a number', () => {
  it('should validate', () => {
    const ik = new Isikukood(60311213742);
    expect(ik.validate()).toBe(true);
  });
});

describe('Strange codes (#22)', () => {
  it('should not start with zero', () => {
    const ik = new Isikukood('01010101010');
    expect(ik.validate()).toBe(false);
  });
});

const getAge = bd => {
  const today = new Date();
  let age = today.getFullYear() - bd.getFullYear();
  if ( today.getMonth() < bd.getMonth() || (today.getMonth() == bd.getMonth() && today.getDate() < bd.getDate()) ) {
    age--;
  }
  return age;
};

