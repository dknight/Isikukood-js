import Isikukood, {Gender, PersonalData} from '../index';
/**
 *  Isikukood test suite.
 *
 *  @author Jaak Ritso
 *  @author Dmitri Smirnov
 *
 *  @2014-2023
 */
('use strict');

describe('Generated Isikukood', () => {
  const generatedIK: string = Isikukood.generate();
  const ik: Isikukood = new Isikukood(generatedIK);
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
    const lastNumber: number = parseInt(generatedIK[10]);
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
      .map(() => Isikukood.generate())
      .forEach((code) => {
        it(code + ' should be valid', () => {
          const ik: Isikukood = new Isikukood(code);
          expect(ik.validate()).toBe(true);
        });
      });
  });

  describe('It should generate female code (#28)', () => {
    Array(200)
      .fill(null)
      .map(() =>
        Isikukood.generate({
          gender: Gender.FEMALE,
        })
      )
      .forEach((code) => {
        it('should be female code', () => {
          const ik: Isikukood = new Isikukood(code);
          expect(ik.getGender()).toBe(Gender.FEMALE);
        });
      });
  });

  describe('It should generate male code (#28)', () => {
    Array(200)
      .fill(null)
      .map(() =>
        Isikukood.generate({
          gender: Gender.MALE,
        })
      )
      .forEach((code) => {
        it('should be female code', () => {
          const ik: Isikukood = new Isikukood(code);
          expect(ik.getGender()).toBe(Gender.MALE);
        });
      });
  });
});

describe('Isikukood 35703150220', () => {
  const ik: Isikukood = new Isikukood('35703150220');
  it('should validate', () => {
    expect(ik.validate()).toBe(true);
  });

  it('should return male as a gender', () => {
    expect(ik.getGender()).toBe(Gender.MALE);
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

  it('should parse the id', () => {
    const expBD = new Date(1957, 2, 15);
    const exp: PersonalData = {
      gender: Gender.MALE,
      age: getAge(expBD),
      birthDay: expBD,
    };
    let got = Isikukood.parse(ik.code);
    expect(got).toStrictEqual(exp);
    got = ik.parse();
    expect(got).toStrictEqual(exp);
  });
});

describe('Isikukood 48709172756', () => {
  const ik: Isikukood = new Isikukood('48709172756');

  it('should not validate', () => {
    expect(ik.validate()).toBe(false);
  });

  it('should return female as a gender', () => {
    expect(ik.getGender()).toBe(Gender.FEMALE);
  });

  it('should return correct age', () => {
    const correctBD: Date = new Date(1987, 8, 17);
    expect(ik.getAge()).toBe(getAge(correctBD));
    expect(ik.getAge() >= 0).toBe(true);
  });

  it('should have controlNumber 6', () => {
    expect(ik.getControlNumber()).not.toEqual(6);
  });
});

describe('Isikukood 28709172754', () => {
  const ik: Isikukood = new Isikukood('28709172754');

  it('should not validate', () => {
    expect(ik.validate()).toBe(false);
  });

  it('should return female as a gender', () => {
    expect(ik.getGender()).toBe(Gender.FEMALE);
  });

  it('should return correct age', () => {
    const correctBD: Date = new Date(1887, 8, 17);
    expect(ik.getAge()).toBe(getAge(correctBD));
    expect(ik.getAge() >= 0).toBe(true);
  });

  it('should have controlNumber 6', () => {
    expect(ik.getControlNumber()).not.toEqual(6);
  });
});

describe('Isikukood 49200186017', () => {
  const ik: Isikukood = new Isikukood('49200186017');
  it('should not validate', () => {
    expect(ik.validate()).toBe(false);
  });
});

describe('Isikukood 60311213742 (#5)', () => {
  const ik: Isikukood = new Isikukood('60311213742');
  it('should validate', () => {
    expect(ik.validate()).toBe(true);
  });

  it('should parse the id', () => {
    const expBD = new Date(2003, 10, 21);
    const exp: PersonalData = {
      gender: Gender.FEMALE,
      age: getAge(expBD),
      birthDay: expBD,
    };
    let got: PersonalData = Isikukood.parse(ik.code);
    expect(got).toStrictEqual(exp);
    got = ik.parse();
    expect(got).toStrictEqual(exp);
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

const getAge = (bd: Date): number => {
  const today: Date = new Date();
  let age: number = today.getFullYear() - bd.getFullYear();
  if (
    today.getMonth() < bd.getMonth() ||
    (today.getMonth() == bd.getMonth() && today.getDate() < bd.getDate())
  ) {
    age--;
  }
  return age;
};
