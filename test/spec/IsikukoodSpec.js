if (typeof Isikukood == 'undefined' && typeof require == 'function') {
  Isikukood = require('../../isikukood');
}

/**
 *  Isikukood test suite.
 *
 *  @author Jaak Ritso
 *  @2015
 */
'use strict';

describe('Generated Isikukood', function () {
	var generatedIK = Isikukood.generate();
	var ik = new Isikukood(generatedIK);
	it('should validate', function () {
		expect(ik.validate()).toBe(true);
	});
	it('should return birthday', function () {
		expect(ik.getBirthday()).toBeDefined();
		expect(ik.getBirthday()).toBeTruthy();
	});
	it('should return age', function () {
		expect(ik.getAge()).toBeDefined();
		expect(ik.getAge()).toBeTruthy();
		expect(ik.getAge() >= 0).toBe(true);
	});
	it('should return gendre', function () {
		expect(ik.getGender()).toBeDefined();
		expect(ik.getGender()).toBeTruthy();
	});
	it('should have correct controlNumber', function() {
		var lastNumber = parseInt(generatedIK[10]);
		expect(ik.getControlNumber()).toBeDefined();
		expect(ik.getControlNumber()).toEqual(lastNumber);
	});
});

describe('Isikukood 35703150220', function () {
	var ik = new Isikukood('35703150220');
	it('should validate', function () {
		expect(ik.validate()).toBe(true);
	});
	it('should return male as a gendre', function () {
		expect(ik.getGender()).toBe('male');
	});
	it('should return age correctly', function () {
		var correct_bd = new Date(1957, 2, 15);
		expect(ik.getAge()).toBe(getAge(correct_bd));
		expect(ik.getAge() >= 0).toBe(true);
	});
	it('should return birthday as 15.03.1957', function () {
		var correct_bd = new Date(1957, 2, 15);
		expect(ik.getBirthday()).toEqual(correct_bd);
	});
	it('should not return birthday as 01.03.1957', function () {
		var wrong_bd = new Date(1957, 2, 1);
		expect(ik.getBirthday()).not.toEqual(wrong_bd);
	});
	it('should have controlNumber 0', function() {
		expect(ik.getControlNumber()).toEqual(0);
	});
});

describe('Isikukood 48709172756', function () {
	var ik = new Isikukood('48709172756');
	it('should not validate', function () {
		expect(ik.validate()).toBe(false);
	});
	it('should return female as a gendre', function () {
		expect(ik.getGender()).toBe('female');
	});
	it('should return correct age', function () {
		var correct_bd = new Date(1987, 8, 17);
		expect(ik.getAge()).toBe(getAge(correct_bd));
		expect(ik.getAge() >= 0).toBe(true);
	});
	it('should have controlNumber 6', function() {
		expect(ik.getControlNumber()).not.toEqual(6);
	});
});

describe('Isikukood 49200186017', function () {
	var ik = new Isikukood('49200186017');
	it('should not validate', function () {
		expect(ik.validate()).toBe(false);
	});
	it('should return female as a gender', function () {
		expect(ik.getGender()).toBe('female');
	});
});

var getAge = function(bd) {
	var today = new Date();
	var age = today.getFullYear() - bd.getFullYear();
	if ( today.getMonth() < bd.getMonth() || (today.getMonth() == bd.getMonth() && today.getDate() < bd.getDate()) ) {
		age--;
	}
	return age;
};

