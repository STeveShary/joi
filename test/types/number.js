'use strict';

// Load modules

const Lab = require('lab');
const Joi = require('../..');
const Helper = require('../helper');


// Declare internals

const internals = {};


// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Lab.expect;


describe('number', () => {

    it('can be called on its own', (done) => {

        const number = Joi.number;
        expect(() => number()).to.throw('Must be invoked on a Joi instance.');
        done();
    });

    it('should throw an exception if arguments were passed.', (done) => {

        expect(
            () => Joi.number('invalid argument.')
        ).to.throw('Joi.number() does not allow arguments.');

        done();
    });

    it('fails on boolean', (done) => {

        const schema = Joi.number();
        Helper.validate(schema, [
            [true, false, null, {
                message: '"value" must be a number',
                details: [{
                    message: '"value" must be a number',
                    path: [],
                    type: 'number.base',
                    context: { label: 'value', key: undefined }
                }]
            }],
            [false, false, null, {
                message: '"value" must be a number',
                details: [{
                    message: '"value" must be a number',
                    path: [],
                    type: 'number.base',
                    context: { label: 'value', key: undefined }
                }]
            }]
        ], done);
    });

    describe('validate()', () => {

        it('should, by default, allow undefined', (done) => {

            Helper.validate(Joi.number(), [
                [undefined, true]
            ], done);
        });

        it('should, when .required(), deny undefined', (done) => {

            Helper.validate(Joi.number().required(), [
                [undefined, false, null, {
                    message: '"value" is required',
                    details: [{
                        message: '"value" is required',
                        path: [],
                        type: 'any.required',
                        context: { label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('should return false for denied value', (done) => {

            const text = Joi.number().invalid(50);
            text.validate(50, (err, value) => {

                expect(err).to.be.an.error('"value" contains an invalid value');
                expect(err.details).to.equal([{
                    message: '"value" contains an invalid value',
                    path: [],
                    type: 'any.invalid',
                    context: { label: 'value', key: undefined }
                }]);
                done();
            });
        });

        it('should validate integer', (done) => {

            const t = Joi.number().integer();
            Helper.validate(t, [
                [100, true],
                [0, true],
                [null, false, null, {
                    message: '"value" must be a number',
                    details: [{
                        message: '"value" must be a number',
                        path: [],
                        type: 'number.base',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [1.02, false, null, {
                    message: '"value" must be an integer',
                    details: [{
                        message: '"value" must be an integer',
                        path: [],
                        type: 'number.integer',
                        context: { value: 1.02, label: 'value', key: undefined }
                    }]
                }],
                [0.01, false, null, {
                    message: '"value" must be an integer',
                    details: [{
                        message: '"value" must be an integer',
                        path: [],
                        type: 'number.integer',
                        context: { value: 0.01, label: 'value', key: undefined }
                    }]
                }],
                ['90071992547409910.1', false, null, {
                    message: '"value" must be an integer',
                    details: [{
                        message: '"value" must be an integer',
                        path: [],
                        type: 'number.integer',
                        context: { value: 90071992547409910.1, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('should return false for Infinity', (done) => {

            const t = Joi.number();
            Helper.validate(t, [
                [Infinity, false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [-Infinity, false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('should return true for allowed Infinity', (done) => {

            const t = Joi.number().allow(Infinity, -Infinity);
            Helper.validate(t, [
                [Infinity, true],
                [-Infinity, true]
            ], done);
        });

        it('can accept string numbers', (done) => {

            const t = Joi.number();
            Helper.validate(t, [
                ['1', true],
                ['100', true],
                ['1e3', true],
                ['1 some text', false, null, {
                    message: '"value" must be a number',
                    details: [{
                        message: '"value" must be a number',
                        path: [],
                        type: 'number.base',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                ['\t\r', false, null, {
                    message: '"value" must be a number',
                    details: [{
                        message: '"value" must be a number',
                        path: [],
                        type: 'number.base',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [' ', false, null, {
                    message: '"value" must be a number',
                    details: [{
                        message: '"value" must be a number',
                        path: [],
                        type: 'number.base',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [' 2', true],
                ['\t\r43', true],
                ['43 ', true],
                ['', false, null, {
                    message: '"value" must be a number',
                    details: [{
                        message: '"value" must be a number',
                        path: [],
                        type: 'number.base',
                        context: { label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('required validates correctly', (done) => {

            const t = Joi.number().required();
            Helper.validate(t, [
                [NaN, false, null, {
                    message: '"value" must be a number',
                    details: [{
                        message: '"value" must be a number',
                        path: [],
                        type: 'number.base',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                ['100', true]
            ], done);
        });

        it('converts an object string to a number', (done) => {

            const config = { a: Joi.number() };
            const obj = { a: '123' };

            Joi.compile(config).validate(obj, (err, value) => {

                expect(err).to.not.exist();
                expect(value.a).to.equal(123);
                done();
            });
        });

        it('converts a string to a number', (done) => {

            Joi.number().validate('1', (err, value) => {

                expect(err).to.not.exist();
                expect(value).to.equal(1);
                done();
            });
        });

        it('errors on null', (done) => {

            Joi.number().validate(null, (err, value) => {

                expect(err).to.be.an.error('"value" must be a number');
                expect(err.details).to.equal([{
                    message: '"value" must be a number',
                    path: [],
                    type: 'number.base',
                    context: { label: 'value', key: undefined }
                }]);
                expect(value).to.equal(null);
                done();
            });
        });

        it('should handle combination of min and max', (done) => {

            const rule = Joi.number().min(8).max(10);
            Helper.validate(rule, [
                [1, false, null, {
                    message: '"value" must be larger than or equal to 8',
                    details: [{
                        message: '"value" must be larger than or equal to 8',
                        path: [],
                        type: 'number.min',
                        context: { limit: 8, value: 1, label: 'value', key: undefined }
                    }]
                }],
                [11, false, null, {
                    message: '"value" must be less than or equal to 10',
                    details: [{
                        message: '"value" must be less than or equal to 10',
                        path: [],
                        type: 'number.max',
                        context: { limit: 10, value: 11, label: 'value', key: undefined }
                    }]
                }],
                [8, true],
                [9, true],
                [null, false, null, {
                    message: '"value" must be a number',
                    details: [{
                        message: '"value" must be a number',
                        path: [],
                        type: 'number.base',
                        context: { label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('should handle combination of min, max, and null allowed', (done) => {

            const rule = Joi.number().min(8).max(10).allow(null);
            Helper.validate(rule, [
                [1, false, null, {
                    message: '"value" must be larger than or equal to 8',
                    details: [{
                        message: '"value" must be larger than or equal to 8',
                        path: [],
                        type: 'number.min',
                        context: { limit: 8, value: 1, label: 'value', key: undefined }
                    }]
                }],
                [11, false, null, {
                    message: '"value" must be less than or equal to 10',
                    details: [{
                        message: '"value" must be less than or equal to 10',
                        path: [],
                        type: 'number.max',
                        context: { limit: 10, value: 11, label: 'value', key: undefined }
                    }]
                }],
                [8, true],
                [9, true],
                [null, true]
            ], done);
        });

        it('should handle combination of min and positive', (done) => {

            const rule = Joi.number().min(-3).positive();
            Helper.validate(rule, [
                [1, true],
                [-2, false, null, {
                    message: '"value" must be a positive number',
                    details: [{
                        message: '"value" must be a positive number',
                        path: [],
                        type: 'number.positive',
                        context: { value: -2, label: 'value', key: undefined }
                    }]
                }],
                [8, true],
                [null, false, null, {
                    message: '"value" must be a number',
                    details: [{
                        message: '"value" must be a number',
                        path: [],
                        type: 'number.base',
                        context: { label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('should handle combination of max and positive', (done) => {

            const rule = Joi.number().max(5).positive();
            Helper.validate(rule, [
                [4, true],
                [-2, false, null, {
                    message: '"value" must be a positive number',
                    details: [{
                        message: '"value" must be a positive number',
                        path: [],
                        type: 'number.positive',
                        context: { value: -2, label: 'value', key: undefined }
                    }]
                }],
                [8, false, null, {
                    message: '"value" must be less than or equal to 5',
                    details: [{
                        message: '"value" must be less than or equal to 5',
                        path: [],
                        type: 'number.max',
                        context: { limit: 5, value: 8, label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a number',
                    details: [{
                        message: '"value" must be a number',
                        path: [],
                        type: 'number.base',
                        context: { label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('should handle combination of min and negative', (done) => {

            const rule = Joi.number().min(-3).negative();
            Helper.validate(rule, [
                [4, false, null, {
                    message: '"value" must be a negative number',
                    details: [{
                        message: '"value" must be a negative number',
                        path: [],
                        type: 'number.negative',
                        context: { value: 4, label: 'value', key: undefined }
                    }]
                }],
                [-2, true],
                [-4, false, null, {
                    message: '"value" must be larger than or equal to -3',
                    details: [{
                        message: '"value" must be larger than or equal to -3',
                        path: [],
                        type: 'number.min',
                        context: { limit: -3, value: -4, label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a number',
                    details: [{
                        message: '"value" must be a number',
                        path: [],
                        type: 'number.base',
                        context: { label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('should handle combination of negative and positive', (done) => {

            const rule = Joi.number().negative().positive();
            Helper.validate(rule, [
                [4, false, null, {
                    message: '"value" must be a negative number',
                    details: [{
                        message: '"value" must be a negative number',
                        path: [],
                        type: 'number.negative',
                        context: { value: 4, label: 'value', key: undefined }
                    }]
                }],
                [-2, false, null, {
                    message: '"value" must be a positive number',
                    details: [{
                        message: '"value" must be a positive number',
                        path: [],
                        type: 'number.positive',
                        context: { value: -2, label: 'value', key: undefined }
                    }]
                }],
                [0, false, null, {
                    message: '"value" must be a negative number',
                    details: [{
                        message: '"value" must be a negative number',
                        path: [],
                        type: 'number.negative',
                        context: { value: 0, label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a number',
                    details: [{
                        message: '"value" must be a number',
                        path: [],
                        type: 'number.base',
                        context: { label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('should handle combination of negative and allow', (done) => {

            const rule = Joi.number().negative().allow(1);
            Helper.validate(rule, [
                [1, true],
                [-10, true],
                [8, false, null, {
                    message: '"value" must be a negative number',
                    details: [{
                        message: '"value" must be a negative number',
                        path: [],
                        type: 'number.negative',
                        context: { value: 8, label: 'value', key: undefined }
                    }]
                }],
                [0, false, null, {
                    message: '"value" must be a negative number',
                    details: [{
                        message: '"value" must be a negative number',
                        path: [],
                        type: 'number.negative',
                        context: { value: 0, label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a number',
                    details: [{
                        message: '"value" must be a number',
                        path: [],
                        type: 'number.base',
                        context: { label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('should handle combination of positive and allow', (done) => {

            const rule = Joi.number().positive().allow(-1);
            Helper.validate(rule, [
                [1, true],
                [-1, true],
                [8, true],
                [-10, false, null, {
                    message: '"value" must be a positive number',
                    details: [{
                        message: '"value" must be a positive number',
                        path: [],
                        type: 'number.positive',
                        context: { value: -10, label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a number',
                    details: [{
                        message: '"value" must be a number',
                        path: [],
                        type: 'number.base',
                        context: { label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('should handle combination of positive, allow, and null allowed', (done) => {

            const rule = Joi.number().positive().allow(-1).allow(null);
            Helper.validate(rule, [
                [1, true],
                [-1, true],
                [8, true],
                [-10, false, null, {
                    message: '"value" must be a positive number',
                    details: [{
                        message: '"value" must be a positive number',
                        path: [],
                        type: 'number.positive',
                        context: { value: -10, label: 'value', key: undefined }
                    }]
                }],
                [null, true]
            ], done);
        });

        it('should handle combination of negative, allow, and null allowed', (done) => {

            const rule = Joi.number().negative().allow(1).allow(null);
            Helper.validate(rule, [
                [1, true],
                [-10, true],
                [8, false, null, {
                    message: '"value" must be a negative number',
                    details: [{
                        message: '"value" must be a negative number',
                        path: [],
                        type: 'number.negative',
                        context: { value: 8, label: 'value', key: undefined }
                    }]
                }],
                [0, false, null, {
                    message: '"value" must be a negative number',
                    details: [{
                        message: '"value" must be a negative number',
                        path: [],
                        type: 'number.negative',
                        context: { value: 0, label: 'value', key: undefined }
                    }]
                }],
                [null, true]
            ], done);
        });

        it('should handle combination of positive, allow, null allowed, and invalid', (done) => {

            const rule = Joi.number().positive().allow(-1).allow(null).invalid(1);
            Helper.validate(rule, [
                [1, false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [-1, true],
                [8, true],
                [-10, false, null, {
                    message: '"value" must be a positive number',
                    details: [{
                        message: '"value" must be a positive number',
                        path: [],
                        type: 'number.positive',
                        context: { value: -10, label: 'value', key: undefined }
                    }]
                }],
                [null, true]
            ], done);
        });

        it('should handle combination of negative, allow, null allowed, and invalid', (done) => {

            const rule = Joi.number().negative().allow(1).allow(null).invalid(-5);
            Helper.validate(rule, [
                [1, true],
                [-10, true],
                [-5, false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [8, false, null, {
                    message: '"value" must be a negative number',
                    details: [{
                        message: '"value" must be a negative number',
                        path: [],
                        type: 'number.negative',
                        context: { value: 8, label: 'value', key: undefined }
                    }]
                }],
                [0, false, null, {
                    message: '"value" must be a negative number',
                    details: [{
                        message: '"value" must be a negative number',
                        path: [],
                        type: 'number.negative',
                        context: { value: 0, label: 'value', key: undefined }
                    }]
                }],
                [null, true]
            ], done);
        });

        it('should handle combination of min, max, and allow', (done) => {

            const rule = Joi.number().min(8).max(10).allow(1);
            Helper.validate(rule, [
                [1, true],
                [11, false, null, {
                    message: '"value" must be less than or equal to 10',
                    details: [{
                        message: '"value" must be less than or equal to 10',
                        path: [],
                        type: 'number.max',
                        context: { limit: 10, value: 11, label: 'value', key: undefined }
                    }]
                }],
                [8, true],
                [9, true],
                [null, false, null, {
                    message: '"value" must be a number',
                    details: [{
                        message: '"value" must be a number',
                        path: [],
                        type: 'number.base',
                        context: { label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('should handle combination of min, max, allow, and null allowed', (done) => {

            const rule = Joi.number().min(8).max(10).allow(1).allow(null);
            Helper.validate(rule, [
                [1, true],
                [11, false, null, {
                    message: '"value" must be less than or equal to 10',
                    details: [{
                        message: '"value" must be less than or equal to 10',
                        path: [],
                        type: 'number.max',
                        context: { limit: 10, value: 11, label: 'value', key: undefined }
                    }]
                }],
                [8, true],
                [9, true],
                [null, true]
            ], done);
        });

        it('should handle combination of min, max, allow, and invalid', (done) => {

            const rule = Joi.number().min(8).max(10).allow(1).invalid(9);
            Helper.validate(rule, [
                [1, true],
                [11, false, null, {
                    message: '"value" must be less than or equal to 10',
                    details: [{
                        message: '"value" must be less than or equal to 10',
                        path: [],
                        type: 'number.max',
                        context: { limit: 10, value: 11, label: 'value', key: undefined }
                    }]
                }],
                [8, true],
                [9, false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a number',
                    details: [{
                        message: '"value" must be a number',
                        path: [],
                        type: 'number.base',
                        context: { label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('should handle combination of min, max, allow, invalid, and null allowed', (done) => {

            const rule = Joi.number().min(8).max(10).allow(1).invalid(9).allow(null);
            Helper.validate(rule, [
                [1, true],
                [11, false, null, {
                    message: '"value" must be less than or equal to 10',
                    details: [{
                        message: '"value" must be less than or equal to 10',
                        path: [],
                        type: 'number.max',
                        context: { limit: 10, value: 11, label: 'value', key: undefined }
                    }]
                }],
                [8, true],
                [9, false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, true]
            ], done);
        });

        it('should handle combination of min, max, and integer', (done) => {

            const rule = Joi.number().min(8).max(10).integer();
            Helper.validate(rule, [
                [1, false, null, {
                    message: '"value" must be larger than or equal to 8',
                    details: [{
                        message: '"value" must be larger than or equal to 8',
                        path: [],
                        type: 'number.min',
                        context: { limit: 8, value: 1, label: 'value', key: undefined }
                    }]
                }],
                [11, false, null, {
                    message: '"value" must be less than or equal to 10',
                    details: [{
                        message: '"value" must be less than or equal to 10',
                        path: [],
                        type: 'number.max',
                        context: { limit: 10, value: 11, label: 'value', key: undefined }
                    }]
                }],
                [8, true],
                [9, true],
                [9.1, false, null, {
                    message: '"value" must be an integer',
                    details: [{
                        message: '"value" must be an integer',
                        path: [],
                        type: 'number.integer',
                        context: { value: 9.1, label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a number',
                    details: [{
                        message: '"value" must be a number',
                        path: [],
                        type: 'number.base',
                        context: { label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('should handle combination of min, max, integer, and allow', (done) => {

            const rule = Joi.number().min(8).max(10).integer().allow(9.1);
            Helper.validate(rule, [
                [1, false, null, {
                    message: '"value" must be larger than or equal to 8',
                    details: [{
                        message: '"value" must be larger than or equal to 8',
                        path: [],
                        type: 'number.min',
                        context: { limit: 8, value: 1, label: 'value', key: undefined }
                    }]
                }],
                [11, false, null, {
                    message: '"value" must be less than or equal to 10',
                    details: [{
                        message: '"value" must be less than or equal to 10',
                        path: [],
                        type: 'number.max',
                        context: { limit: 10, value: 11, label: 'value', key: undefined }
                    }]
                }],
                [8, true],
                [9, true],
                [9.1, true],
                [9.2, false, null, {
                    message: '"value" must be an integer',
                    details: [{
                        message: '"value" must be an integer',
                        path: [],
                        type: 'number.integer',
                        context: { value: 9.2, label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a number',
                    details: [{
                        message: '"value" must be a number',
                        path: [],
                        type: 'number.base',
                        context: { label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('should handle combination of min, max, integer, allow, and invalid', (done) => {

            const rule = Joi.number().min(8).max(10).integer().allow(9.1).invalid(8);
            Helper.validate(rule, [
                [1, false, null, {
                    message: '"value" must be larger than or equal to 8',
                    details: [{
                        message: '"value" must be larger than or equal to 8',
                        path: [],
                        type: 'number.min',
                        context: { limit: 8, value: 1, label: 'value', key: undefined }
                    }]
                }],
                [11, false, null, {
                    message: '"value" must be less than or equal to 10',
                    details: [{
                        message: '"value" must be less than or equal to 10',
                        path: [],
                        type: 'number.max',
                        context: { limit: 10, value: 11, label: 'value', key: undefined }
                    }]
                }],
                [8, false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [9, true],
                [9.1, true],
                [9.2, false, null, {
                    message: '"value" must be an integer',
                    details: [{
                        message: '"value" must be an integer',
                        path: [],
                        type: 'number.integer',
                        context: { value: 9.2, label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a number',
                    details: [{
                        message: '"value" must be a number',
                        path: [],
                        type: 'number.base',
                        context: { label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('should handle combination of min, max, integer, allow, invalid, and null allowed', (done) => {

            const rule = Joi.number().min(8).max(10).integer().allow(9.1).invalid(8).allow(null);
            Helper.validate(rule, [
                [1, false, null, {
                    message: '"value" must be larger than or equal to 8',
                    details: [{
                        message: '"value" must be larger than or equal to 8',
                        path: [],
                        type: 'number.min',
                        context: { limit: 8, value: 1, label: 'value', key: undefined }
                    }]
                }],
                [11, false, null, {
                    message: '"value" must be less than or equal to 10',
                    details: [{
                        message: '"value" must be less than or equal to 10',
                        path: [],
                        type: 'number.max',
                        context: { limit: 10, value: 11, label: 'value', key: undefined }
                    }]
                }],
                [8, false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [9, true],
                [9.1, true],
                [9.2, false, null, {
                    message: '"value" must be an integer',
                    details: [{
                        message: '"value" must be an integer',
                        path: [],
                        type: 'number.integer',
                        context: { value: 9.2, label: 'value', key: undefined }
                    }]
                }],
                [null, true]
            ], done);
        });

        it('should handle limiting the number of decimal places', (done) => {

            const rule = Joi.number().precision(1).options({ convert: false });
            Helper.validate(rule, [
                [1, true],
                [9.1, true],
                [9.21, false, null, {
                    message: '"value" must have no more than 1 decimal places',
                    details: [{
                        message: '"value" must have no more than 1 decimal places',
                        path: [],
                        type: 'number.precision',
                        context: { limit: 1, value: 9.21, label: 'value', key: undefined }
                    }]
                }],
                [9.9999, false, null, {
                    message: '"value" must have no more than 1 decimal places',
                    details: [{
                        message: '"value" must have no more than 1 decimal places',
                        path: [],
                        type: 'number.precision',
                        context: { limit: 1, value: 9.9999, label: 'value', key: undefined }
                    }]
                }],
                [9.999e99, true],
                [9.9e-99, false, null, {
                    message: '"value" must have no more than 1 decimal places',
                    details: [{
                        message: '"value" must have no more than 1 decimal places',
                        path: [],
                        type: 'number.precision',
                        context: { limit: 1, value: 9.9e-99, label: 'value', key: undefined }
                    }]
                }],
                [9.9e3, true],
                [null, false, null, {
                    message: '"value" must be a number',
                    details: [{
                        message: '"value" must be a number',
                        path: [],
                        type: 'number.base',
                        context: { label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('should handle combination of min, max, integer, allow, invalid, null allowed and precision', (done) => {

            const rule = Joi.number().min(8).max(10).integer().allow(9.1).invalid(8).allow(null).precision(1).options({ convert: false });
            Helper.validate(rule, [
                [1, false, null, {
                    message: '"value" must be larger than or equal to 8',
                    details: [{
                        message: '"value" must be larger than or equal to 8',
                        path: [],
                        type: 'number.min',
                        context: { limit: 8, value: 1, label: 'value', key: undefined }
                    }]
                }],
                [11, false, null, {
                    message: '"value" must be less than or equal to 10',
                    details: [{
                        message: '"value" must be less than or equal to 10',
                        path: [],
                        type: 'number.max',
                        context: { limit: 10, value: 11, label: 'value', key: undefined }
                    }]
                }],
                [8, false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [9, true],
                [9.1, true],
                [9.11, false, null, {
                    message: '"value" must be an integer',
                    details: [{
                        message: '"value" must be an integer',
                        path: [],
                        type: 'number.integer',
                        context: { value: 9.11, label: 'value', key: undefined }
                    }]
                }],
                [9.2, false, null, {
                    message: '"value" must be an integer',
                    details: [{
                        message: '"value" must be an integer',
                        path: [],
                        type: 'number.integer',
                        context: { value: 9.2, label: 'value', key: undefined }
                    }]
                }],
                [9.22, false, null, {
                    message: '"value" must be an integer',
                    details: [{
                        message: '"value" must be an integer',
                        path: [],
                        type: 'number.integer',
                        context: { value: 9.22, label: 'value', key: undefined }
                    }]
                }],
                [null, true]
            ], done);
        });

        it('should handle combination of greater and less', (done) => {

            const rule = Joi.number().greater(5).less(10);
            Helper.validate(rule, [
                [0, false, null, {
                    message: '"value" must be greater than 5',
                    details: [{
                        message: '"value" must be greater than 5',
                        path: [],
                        type: 'number.greater',
                        context: { limit: 5, value: 0, label: 'value', key: undefined }
                    }]
                }],
                [11, false, null, {
                    message: '"value" must be less than 10',
                    details: [{
                        message: '"value" must be less than 10',
                        path: [],
                        type: 'number.less',
                        context: { limit: 10, value: 11, label: 'value', key: undefined }
                    }]
                }],
                [5, false, null, {
                    message: '"value" must be greater than 5',
                    details: [{
                        message: '"value" must be greater than 5',
                        path: [],
                        type: 'number.greater',
                        context: { limit: 5, value: 5, label: 'value', key: undefined }
                    }]
                }],
                [10, false, null, {
                    message: '"value" must be less than 10',
                    details: [{
                        message: '"value" must be less than 10',
                        path: [],
                        type: 'number.less',
                        context: { limit: 10, value: 10, label: 'value', key: undefined }
                    }]
                }],
                [8, true],
                [5.01, true],
                [9.99, true],
                [null, false, null, {
                    message: '"value" must be a number',
                    details: [{
                        message: '"value" must be a number',
                        path: [],
                        type: 'number.base',
                        context: { label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('should handle combination of greater, less, and integer', (done) => {

            const rule = Joi.number().integer().greater(5).less(10);
            Helper.validate(rule, [
                [0, false, null, {
                    message: '"value" must be greater than 5',
                    details: [{
                        message: '"value" must be greater than 5',
                        path: [],
                        type: 'number.greater',
                        context: { limit: 5, value: 0, label: 'value', key: undefined }
                    }]
                }],
                [11, false, null, {
                    message: '"value" must be less than 10',
                    details: [{
                        message: '"value" must be less than 10',
                        path: [],
                        type: 'number.less',
                        context: { limit: 10, value: 11, label: 'value', key: undefined }
                    }]
                }],
                [5, false, null, {
                    message: '"value" must be greater than 5',
                    details: [{
                        message: '"value" must be greater than 5',
                        path: [],
                        type: 'number.greater',
                        context: { limit: 5, value: 5, label: 'value', key: undefined }
                    }]
                }],
                [10, false, null, {
                    message: '"value" must be less than 10',
                    details: [{
                        message: '"value" must be less than 10',
                        path: [],
                        type: 'number.less',
                        context: { limit: 10, value: 10, label: 'value', key: undefined }
                    }]
                }],
                [6, true],
                [9, true],
                [5.01, false, null, {
                    message: '"value" must be an integer',
                    details: [{
                        message: '"value" must be an integer',
                        path: [],
                        type: 'number.integer',
                        context: { value: 5.01, label: 'value', key: undefined }
                    }]
                }],
                [9.99, false, null, {
                    message: '"value" must be an integer',
                    details: [{
                        message: '"value" must be an integer',
                        path: [],
                        type: 'number.integer',
                        context: { value: 9.99, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('should handle combination of greater, less, and null allowed', (done) => {

            const rule = Joi.number().greater(5).less(10).allow(null);
            Helper.validate(rule, [
                [0, false, null, {
                    message: '"value" must be greater than 5',
                    details: [{
                        message: '"value" must be greater than 5',
                        path: [],
                        type: 'number.greater',
                        context: { limit: 5, value: 0, label: 'value', key: undefined }
                    }]
                }],
                [11, false, null, {
                    message: '"value" must be less than 10',
                    details: [{
                        message: '"value" must be less than 10',
                        path: [],
                        type: 'number.less',
                        context: { limit: 10, value: 11, label: 'value', key: undefined }
                    }]
                }],
                [5, false, null, {
                    message: '"value" must be greater than 5',
                    details: [{
                        message: '"value" must be greater than 5',
                        path: [],
                        type: 'number.greater',
                        context: { limit: 5, value: 5, label: 'value', key: undefined }
                    }]
                }],
                [10, false, null, {
                    message: '"value" must be less than 10',
                    details: [{
                        message: '"value" must be less than 10',
                        path: [],
                        type: 'number.less',
                        context: { limit: 10, value: 10, label: 'value', key: undefined }
                    }]
                }],
                [8, true],
                [5.01, true],
                [9.99, true],
                [null, true]
            ], done);
        });

        it('should handle combination of greater, less, invalid, and allow', (done) => {

            const rule = Joi.number().greater(5).less(10).invalid(6).allow(-3);
            Helper.validate(rule, [
                [0, false, null, {
                    message: '"value" must be greater than 5',
                    details: [{
                        message: '"value" must be greater than 5',
                        path: [],
                        type: 'number.greater',
                        context: { limit: 5, value: 0, label: 'value', key: undefined }
                    }]
                }],
                [11, false, null, {
                    message: '"value" must be less than 10',
                    details: [{
                        message: '"value" must be less than 10',
                        path: [],
                        type: 'number.less',
                        context: { limit: 10, value: 11, label: 'value', key: undefined }
                    }]
                }],
                [5, false, null, {
                    message: '"value" must be greater than 5',
                    details: [{
                        message: '"value" must be greater than 5',
                        path: [],
                        type: 'number.greater',
                        context: { limit: 5, value: 5, label: 'value', key: undefined }
                    }]
                }],
                [10, false, null, {
                    message: '"value" must be less than 10',
                    details: [{
                        message: '"value" must be less than 10',
                        path: [],
                        type: 'number.less',
                        context: { limit: 10, value: 10, label: 'value', key: undefined }
                    }]
                }],
                [6, false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [8, true],
                [5.01, true],
                [9.99, true],
                [-3, true],
                [null, false, null, {
                    message: '"value" must be a number',
                    details: [{
                        message: '"value" must be a number',
                        path: [],
                        type: 'number.base',
                        context: { label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });
    });

    it('should instantiate separate copies on invocation', (done) => {

        const result1 = Joi.number().min(5);
        const result2 = Joi.number().max(5);

        expect(Object.keys(result1)).to.not.shallow.equal(Object.keys(result2));
        done();
    });

    it('should show resulting object with #valueOf', (done) => {

        const result = Joi.number().min(5);
        expect(result.valueOf()).to.exist();
        done();
    });

    describe('error message', () => {

        it('should display correctly for int type', (done) => {

            const t = Joi.number().integer();
            Joi.compile(t).validate('1.1', (err, value) => {

                expect(err.message).to.contain('integer');
                done();
            });
        });
    });

    describe('min()', () => {

        it('throws when limit is not a number', (done) => {

            expect(() => {

                Joi.number().min('a');
            }).to.throw('limit must be a number or reference');
            done();
        });

        it('supports 64bit numbers', (done) => {

            const schema = Joi.number().min(1394035612500);
            const input = 1394035612552;

            schema.validate(input, (err, value) => {

                expect(err).to.not.exist();
                expect(value).to.equal(input);
                done();
            });
        });

        it('accepts references as min value', (done) => {

            const schema = Joi.object({ a: Joi.number(), b: Joi.number().min(Joi.ref('a')) });

            Helper.validate(schema, [
                [{ a: 42, b: 1337 }, true],
                [{ a: 1337, b: 42 }, false, null, {
                    message: 'child "b" fails because ["b" must be larger than or equal to 1337]',
                    details: [{
                        message: '"b" must be larger than or equal to 1337',
                        path: ['b'],
                        type: 'number.min',
                        context: { limit: 1337, value: 42, label: 'b', key: 'b' }
                    }]
                }],
                [{ a: '1337', b: 42 }, false, null, {
                    message: 'child "b" fails because ["b" must be larger than or equal to 1337]',
                    details: [{
                        message: '"b" must be larger than or equal to 1337',
                        path: ['b'],
                        type: 'number.min',
                        context: { limit: 1337, value: 42, label: 'b', key: 'b' }
                    }]
                }],
                [{ a: 2.4, b: 4.2 }, true],
                [{ a: 4.2, b: 4.20000001 }, true],
                [{ a: 4.20000001, b: 4.2 }, false, null, {
                    message: 'child "b" fails because ["b" must be larger than or equal to 4.20000001]',
                    details: [{
                        message: '"b" must be larger than or equal to 4.20000001',
                        path: ['b'],
                        type: 'number.min',
                        context: { limit: 4.20000001, value: 4.2, label: 'b', key: 'b' }
                    }]
                }],
                [{ a: 4.2, b: 2.4 }, false, null, {
                    message: 'child "b" fails because ["b" must be larger than or equal to 4.2]',
                    details: [{
                        message: '"b" must be larger than or equal to 4.2',
                        path: ['b'],
                        type: 'number.min',
                        context: { limit: 4.2, value: 2.4, label: 'b', key: 'b' }
                    }]
                }]
            ], done);
        });

        it('accepts references as min value within a when', (done) => {

            const schema = Joi.object({
                a: Joi.number().required(),
                b: Joi.number().required(),
                c: Joi.number().required().when('a', {
                    is: Joi.number().min(Joi.ref('b')), // a >= b
                    then: Joi.number().valid(0)
                })
            });

            Helper.validate(schema, [
                [{ a: 0, b: 1, c: 42 }, true],
                [{ a: 1, b: 1, c: 0 }, true],
                [{ a: 2, b: 1, c: 0 }, true],
                [{ a: 1, b: 1, c: 42 }, false, null, {
                    message: 'child "c" fails because ["c" must be one of [0]]',
                    details: [{
                        message: '"c" must be one of [0]',
                        path: ['c'],
                        type: 'any.allowOnly',
                        context: { valids: [0], label: 'c', key: 'c' }
                    }]
                }],
                [{ a: 2, b: 1, c: 42 }, false, null, {
                    message: 'child "c" fails because ["c" must be one of [0]]',
                    details: [{
                        message: '"c" must be one of [0]',
                        path: ['c'],
                        type: 'any.allowOnly',
                        context: { valids: [0], label: 'c', key: 'c' }
                    }]
                }]
            ], done);
        });

        it('accepts context references as min value', (done) => {

            const schema = Joi.object({ b: Joi.number().min(Joi.ref('$a')) });

            Helper.validate(schema, [
                [{ b: 1337 }, true, { context: { a: 42 } }],
                [{ b: 42 }, false, { context: { a: 1337 } }, {
                    message: 'child "b" fails because ["b" must be larger than or equal to 1337]',
                    details: [{
                        message: '"b" must be larger than or equal to 1337',
                        path: ['b'],
                        type: 'number.min',
                        context: { limit: 1337, value: 42, label: 'b', key: 'b' }
                    }]
                }],
                [{ b: 4.2 }, true, { context: { a: 2.4 } }],
                [{ b: 4.20000001 }, true, { context: { a: 4.2 } }],
                [{ b: 4.2 }, false, { context: { a: 4.20000001 } }, {
                    message: 'child "b" fails because ["b" must be larger than or equal to 4.20000001]',
                    details: [{
                        message: '"b" must be larger than or equal to 4.20000001',
                        path: ['b'],
                        type: 'number.min',
                        context: { limit: 4.20000001, value: 4.2, label: 'b', key: 'b' }
                    }]
                }],
                [{ b: 2.4 }, false, { context: { a: 4.2 } }, {
                    message: 'child "b" fails because ["b" must be larger than or equal to 4.2]',
                    details: [{
                        message: '"b" must be larger than or equal to 4.2',
                        path: ['b'],
                        type: 'number.min',
                        context: { limit: 4.2, value: 2.4, label: 'b', key: 'b' }
                    }]
                }]
            ], done);
        });

        it('errors if reference is not a number', (done) => {

            const schema = Joi.object({ a: Joi.string(), b: Joi.number().min(Joi.ref('a')) });

            Helper.validate(schema, [
                [{ a: 'abc', b: 42 }, false, null, {
                    message: 'child "b" fails because ["b" references "a" which is not a number]',
                    details: [{
                        message: '"b" references "a" which is not a number',
                        path: ['b'],
                        type: 'number.ref',
                        context: { ref: 'a', label: 'b', key: 'b' }
                    }]
                }]
            ], done);
        });

        it('errors if context reference is not a number', (done) => {

            const schema = Joi.object({ b: Joi.number().min(Joi.ref('$a')) });

            Helper.validate(schema, [
                [{ b: 42 }, false, { context: { a: 'abc' } }, {
                    message: 'child "b" fails because ["b" references "a" which is not a number]',
                    details: [{
                        message: '"b" references "a" which is not a number',
                        path: ['b'],
                        type: 'number.ref',
                        context: { ref: 'a', label: 'b', key: 'b' }
                    }]
                }]
            ], done);
        });
    });

    describe('max()', () => {

        it('throws when limit is not a number', (done) => {

            expect(() => {

                Joi.number().max('a');
            }).to.throw('limit must be a number or reference');
            done();
        });

        it('accepts references as max value', (done) => {

            const schema = Joi.object({ a: Joi.number(), b: Joi.number().max(Joi.ref('a')) });

            Helper.validate(schema, [
                [{ a: 1337, b: 42 }, true],
                [{ a: 42, b: 1337 }, false, null, {
                    message: 'child "b" fails because ["b" must be less than or equal to 42]',
                    details: [{
                        message: '"b" must be less than or equal to 42',
                        path: ['b'],
                        type: 'number.max',
                        context: { limit: 42, value: 1337, label: 'b', key: 'b' }
                    }]
                }],
                [{ a: '42', b: 1337 }, false, null, {
                    message: 'child "b" fails because ["b" must be less than or equal to 42]',
                    details: [{
                        message: '"b" must be less than or equal to 42',
                        path: ['b'],
                        type: 'number.max',
                        context: { limit: 42, value: 1337, label: 'b', key: 'b' }
                    }]
                }],
                [{ a: 4.2, b: 2.4 }, true],
                [{ a: 4.2, b: 4.20000001 }, false, null, {
                    message: 'child "b" fails because ["b" must be less than or equal to 4.2]',
                    details: [{
                        message: '"b" must be less than or equal to 4.2',
                        path: ['b'],
                        type: 'number.max',
                        context: { limit: 4.2, value: 4.20000001, label: 'b', key: 'b' }
                    }]
                }],
                [{ a: 4.20000001, b: 4.2 }, true],
                [{ a: 2.4, b: 4.2 }, false, null, {
                    message: 'child "b" fails because ["b" must be less than or equal to 2.4]',
                    details: [{
                        message: '"b" must be less than or equal to 2.4',
                        path: ['b'],
                        type: 'number.max',
                        context: { limit: 2.4, value: 4.2, label: 'b', key: 'b' }
                    }]
                }]
            ], done);
        });

        it('accepts context references as max value', (done) => {

            const schema = Joi.object({ b: Joi.number().max(Joi.ref('$a')) });

            Helper.validate(schema, [
                [{ b: 42 }, true, { context: { a: 1337 } }],
                [{ b: 1337 }, false, { context: { a: 42 } }, {
                    message: 'child "b" fails because ["b" must be less than or equal to 42]',
                    details: [{
                        message: '"b" must be less than or equal to 42',
                        path: ['b'],
                        type: 'number.max',
                        context: { limit: 42, value: 1337, label: 'b', key: 'b' }
                    }]
                }],
                [{ b: 2.4 }, true, { context: { a: 4.2 } }],
                [{ b: 4.20000001 }, false, { context: { a: 4.2 } }, {
                    message: 'child "b" fails because ["b" must be less than or equal to 4.2]',
                    details: [{
                        message: '"b" must be less than or equal to 4.2',
                        path: ['b'],
                        type: 'number.max',
                        context: { limit: 4.2, value: 4.20000001, label: 'b', key: 'b' }
                    }]
                }],
                [{ b: 4.2 }, true, { context: { a: 4.20000001 } }],
                [{ b: 4.2 }, false, { context: { a: 2.4 } }, {
                    message: 'child "b" fails because ["b" must be less than or equal to 2.4]',
                    details: [{
                        message: '"b" must be less than or equal to 2.4',
                        path: ['b'],
                        type: 'number.max',
                        context: { limit: 2.4, value: 4.2, label: 'b', key: 'b' }
                    }]
                }]
            ], done);
        });

        it('errors if reference is not a number', (done) => {

            const schema = Joi.object({ a: Joi.string(), b: Joi.number().max(Joi.ref('a')) });

            Helper.validate(schema, [
                [{ a: 'abc', b: 42 }, false, null, {
                    message: 'child "b" fails because ["b" references "a" which is not a number]',
                    details: [{
                        message: '"b" references "a" which is not a number',
                        path: ['b'],
                        type: 'number.ref',
                        context: { ref: 'a', label: 'b', key: 'b' }
                    }]
                }]
            ], done);
        });

        it('errors if context reference is not a number', (done) => {

            const schema = Joi.object({ b: Joi.number().max(Joi.ref('$a')) });

            Helper.validate(schema, [
                [{ b: 42 }, false, { context: { a: 'abc' } }, {
                    message: 'child "b" fails because ["b" references "a" which is not a number]',
                    details: [{
                        message: '"b" references "a" which is not a number',
                        path: ['b'],
                        type: 'number.ref',
                        context: { ref: 'a', label: 'b', key: 'b' }
                    }]
                }]
            ], done);
        });
    });

    describe('less()', () => {

        it('throws when limit is not a number', (done) => {

            expect(() => {

                Joi.number().less('a');
            }).to.throw('limit must be a number or reference');
            done();
        });

        it('accepts references as less value', (done) => {

            const schema = Joi.object({ a: Joi.number(), b: Joi.number().less(Joi.ref('a')) });

            Helper.validate(schema, [
                [{ a: 1337, b: 42 }, true],
                [{ a: 42, b: 1337 }, false, null, {
                    message: 'child "b" fails because ["b" must be less than 42]',
                    details: [{
                        message: '"b" must be less than 42',
                        path: ['b'],
                        type: 'number.less',
                        context: { limit: 42, value: 1337, label: 'b', key: 'b' }
                    }]
                }],
                [{ a: '42', b: 1337 }, false, null, {
                    message: 'child "b" fails because ["b" must be less than 42]',
                    details: [{
                        message: '"b" must be less than 42',
                        path: ['b'],
                        type: 'number.less',
                        context: { limit: 42, value: 1337, label: 'b', key: 'b' }
                    }]
                }],
                [{ a: 4.2, b: 2.4 }, true],
                [{ a: 4.2, b: 4.20000001 }, false, null, {
                    message: 'child "b" fails because ["b" must be less than 4.2]',
                    details: [{
                        message: '"b" must be less than 4.2',
                        path: ['b'],
                        type: 'number.less',
                        context: { limit: 4.2, value: 4.20000001, label: 'b', key: 'b' }
                    }]
                }],
                [{ a: 4.20000001, b: 4.2 }, true],
                [{ a: 2.4, b: 4.2 }, false, null, {
                    message: 'child "b" fails because ["b" must be less than 2.4]',
                    details: [{
                        message: '"b" must be less than 2.4',
                        path: ['b'],
                        type: 'number.less',
                        context: { limit: 2.4, value: 4.2, label: 'b', key: 'b' }
                    }]
                }]
            ], done);
        });

        it('accepts context references as less value', (done) => {

            const schema = Joi.object({ b: Joi.number().less(Joi.ref('$a')) });

            Helper.validate(schema, [
                [{ b: 42 }, true, { context: { a: 1337 } }],
                [{ b: 1337 }, false, { context: { a: 42 } }, {
                    message: 'child "b" fails because ["b" must be less than 42]',
                    details: [{
                        message: '"b" must be less than 42',
                        path: ['b'],
                        type: 'number.less',
                        context: { limit: 42, value: 1337, label: 'b', key: 'b' }
                    }]
                }],
                [{ b: 2.4 }, true, { context: { a: 4.2 } }],
                [{ b: 4.20000001 }, false, { context: { a: 4.2 } }, {
                    message: 'child "b" fails because ["b" must be less than 4.2]',
                    details: [{
                        message: '"b" must be less than 4.2',
                        path: ['b'],
                        type: 'number.less',
                        context: { limit: 4.2, value: 4.20000001, label: 'b', key: 'b' }
                    }]
                }],
                [{ b: 4.2 }, true, { context: { a: 4.20000001 } }],
                [{ b: 4.2 }, false, { context: { a: 2.4 } }, {
                    message: 'child "b" fails because ["b" must be less than 2.4]',
                    details: [{
                        message: '"b" must be less than 2.4',
                        path: ['b'],
                        type: 'number.less',
                        context: { limit: 2.4, value: 4.2, label: 'b', key: 'b' }
                    }]
                }]
            ], done);
        });

        it('errors if reference is not a number', (done) => {

            const schema = Joi.object({ a: Joi.string(), b: Joi.number().less(Joi.ref('a')) });

            Helper.validate(schema, [
                [{ a: 'abc', b: 42 }, false, null, {
                    message: 'child "b" fails because ["b" references "a" which is not a number]',
                    details: [{
                        message: '"b" references "a" which is not a number',
                        path: ['b'],
                        type: 'number.ref',
                        context: { ref: 'a', label: 'b', key: 'b' }
                    }]
                }]
            ], done);
        });

        it('errors if context reference is not a number', (done) => {

            const schema = Joi.object({ a: Joi.string(), b: Joi.number().less(Joi.ref('$a')) });

            Helper.validate(schema, [
                [{ b: 42 }, false, { context: { a: 'abc' } }, {
                    message: 'child "b" fails because ["b" references "a" which is not a number]',
                    details: [{
                        message: '"b" references "a" which is not a number',
                        path: ['b'],
                        type: 'number.ref',
                        context: { ref: 'a', label: 'b', key: 'b' }
                    }]
                }]
            ], done);
        });
    });

    describe('greater()', () => {

        it('throws when limit is not a number', (done) => {

            expect(() => {

                Joi.number().greater('a');
            }).to.throw('limit must be a number or reference');
            done();
        });

        it('accepts references as greater value', (done) => {

            const schema = Joi.object({ a: Joi.number(), b: Joi.number().greater(Joi.ref('a')) });

            Helper.validate(schema, [
                [{ a: 42, b: 1337 }, true],
                [{ a: 1337, b: 42 }, false, null, {
                    message: 'child "b" fails because ["b" must be greater than 1337]',
                    details: [{
                        message: '"b" must be greater than 1337',
                        path: ['b'],
                        type: 'number.greater',
                        context: { limit: 1337, value: 42, label: 'b', key: 'b' }
                    }]
                }],
                [{ a: '1337', b: 42 }, false, null, {
                    message: 'child "b" fails because ["b" must be greater than 1337]',
                    details: [{
                        message: '"b" must be greater than 1337',
                        path: ['b'],
                        type: 'number.greater',
                        context: { limit: 1337, value: 42, label: 'b', key: 'b' }
                    }]
                }],
                [{ a: 2.4, b: 4.2 }, true],
                [{ a: 4.2, b: 4.20000001 }, true],
                [{
                    a: 4.20000001,
                    b: 4.2
                }, false, null, {
                    message: 'child "b" fails because ["b" must be greater than 4.20000001]',
                    details: [{
                        message: '"b" must be greater than 4.20000001',
                        path: ['b'],
                        type: 'number.greater',
                        context: { limit: 4.20000001, value: 4.2, label: 'b', key: 'b' }
                    }]
                }],
                [{ a: 4.2, b: 2.4 }, false, null, {
                    message: 'child "b" fails because ["b" must be greater than 4.2]',
                    details: [{
                        message: '"b" must be greater than 4.2',
                        path: ['b'],
                        type: 'number.greater',
                        context: { limit: 4.2, value: 2.4, label: 'b', key: 'b' }
                    }]
                }]
            ], done);
        });

        it('accepts context references as greater value', (done) => {

            const schema = Joi.object({ b: Joi.number().greater(Joi.ref('$a')) });

            Helper.validate(schema, [
                [{ b: 1337 }, true, { context: { a: 42 } }],
                [{ b: 42 }, false, { context: { a: 1337 } }, {
                    message: 'child "b" fails because ["b" must be greater than 1337]',
                    details: [{
                        message: '"b" must be greater than 1337',
                        path: ['b'],
                        type: 'number.greater',
                        context: { limit: 1337, value: 42, label: 'b', key: 'b' }
                    }]
                }],
                [{ b: 4.2 }, true, { context: { a: 2.4 } }],
                [{ b: 4.20000001 }, true, { context: { a: 4.2 } }],
                [{ b: 4.2 }, false, { context: { a: 4.20000001 } }, {
                    message: 'child "b" fails because ["b" must be greater than 4.20000001]',
                    details: [{
                        message: '"b" must be greater than 4.20000001',
                        path: ['b'],
                        type: 'number.greater',
                        context: { limit: 4.20000001, value: 4.2, label: 'b', key: 'b' }
                    }]
                }],
                [{ b: 2.4 }, false, { context: { a: 4.2 } }, {
                    message: 'child "b" fails because ["b" must be greater than 4.2]',
                    details: [{
                        message: '"b" must be greater than 4.2',
                        path: ['b'],
                        type: 'number.greater',
                        context: { limit: 4.2, value: 2.4, label: 'b', key: 'b' }
                    }]
                }]
            ], done);
        });

        it('errors if reference is not a number', (done) => {

            const schema = Joi.object({ a: Joi.string(), b: Joi.number().greater(Joi.ref('a')) });

            Helper.validate(schema, [
                [{ a: 'abc', b: 42 }, false, null, {
                    message: 'child "b" fails because ["b" references "a" which is not a number]',
                    details: [{
                        message: '"b" references "a" which is not a number',
                        path: ['b'],
                        type: 'number.ref',
                        context: { ref: 'a', label: 'b', key: 'b' }
                    }]
                }]
            ], done);
        });

        it('errors if context reference is not a number', (done) => {

            const schema = Joi.object({ b: Joi.number().greater(Joi.ref('$a')) });

            Helper.validate(schema, [
                [{ b: 42 }, false, { context: { a: 'abc' } }, {
                    message: 'child "b" fails because ["b" references "a" which is not a number]',
                    details: [{
                        message: '"b" references "a" which is not a number',
                        path: ['b'],
                        type: 'number.ref',
                        context: { ref: 'a', label: 'b', key: 'b' }
                    }]
                }]
            ], done);
        });
    });

    describe('precision()', () => {

        it('converts numbers', (done) => {

            const rule = Joi.number().precision(4);
            Helper.validate(rule, [
                [1.5, true, null, 1.5],
                [0.12345, true, null, 0.1235],
                [123456, true, null, 123456],
                [123456.123456, true, null, 123456.1235],
                ['123456.123456', true, null, 123456.1235],
                ['abc', false, null, {
                    message: '"value" must be a number',
                    details: [{
                        message: '"value" must be a number',
                        path: [],
                        type: 'number.base',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [NaN, false, null, {
                    message: '"value" must be a number',
                    details: [{
                        message: '"value" must be a number',
                        path: [],
                        type: 'number.base',
                        context: { label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });
    });

    describe('describe()', () => {

        it('should describe a minimum of 0', (done) => {

            const schema = Joi.number().min(0);
            expect(schema.describe()).to.equal({
                type: 'number',
                invalids: [Infinity, -Infinity],
                rules: [
                    {
                        name: 'min',
                        arg: 0
                    }
                ]
            });
            done();
        });
    });

    describe('multiple()', () => {

        it('throws when multiple is not a number', (done) => {

            expect(() => {

                Joi.number().multiple('a');
            }).to.throw('multiple must be a number');
            done();
        });

        it('throws when multiple is 0', (done) => {

            expect(() => {

                Joi.number().multiple(0);
            }).to.throw('multiple must be greater than 0');
            done();
        });

        it('should handle integer multiples correctly', (done) => {

            const rule = Joi.number().multiple(3);
            Helper.validate(rule, [
                [0, true], // 0 is a multiple of every integer
                [3, true],
                [4, false, null, {
                    message: '"value" must be a multiple of 3',
                    details: [{
                        message: '"value" must be a multiple of 3',
                        path: [],
                        type: 'number.multiple',
                        context: { multiple: 3, value: 4, label: 'value', key: undefined }
                    }]
                }],
                [9, true],
                ['a', false, null, {
                    message: '"value" must be a number',
                    details: [{
                        message: '"value" must be a number',
                        path: [],
                        type: 'number.base',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [9.1, false, null, {
                    message: '"value" must be a multiple of 3',
                    details: [{
                        message: '"value" must be a multiple of 3',
                        path: [],
                        type: 'number.multiple',
                        context: { multiple: 3, value: 9.1, label: 'value', key: undefined }
                    }]
                }],
                [8.9, false, null, {
                    message: '"value" must be a multiple of 3',
                    details: [{
                        message: '"value" must be a multiple of 3',
                        path: [],
                        type: 'number.multiple',
                        context: { multiple: 3, value: 8.9, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('should handle floats multiples correctly', (done) => {

            const schema = Joi.number().multiple(3.5);
            Helper.validate(schema, [
                [0, true], // 0 is a multiple of every integer
                [3.5, true],
                [3.6, false, null, {
                    message: '"value" must be a multiple of 3.5',
                    details: [{
                        message: '"value" must be a multiple of 3.5',
                        path: [],
                        type: 'number.multiple',
                        context: { multiple: 3.5, value: 3.6, label: 'value', key: undefined }
                    }]
                }],
                [10.5, true],
                ['a', false, null, {
                    message: '"value" must be a number',
                    details: [{
                        message: '"value" must be a number',
                        path: [],
                        type: 'number.base',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [10.501, false, null, {
                    message: '"value" must be a multiple of 3.5',
                    details: [{
                        message: '"value" must be a multiple of 3.5',
                        path: [],
                        type: 'number.multiple',
                        context: { multiple: 3.5, value: 10.501, label: 'value', key: undefined }
                    }]
                }],
                [10.499, false, null, {
                    message: '"value" must be a multiple of 3.5',
                    details: [{
                        message: '"value" must be a multiple of 3.5',
                        path: [],
                        type: 'number.multiple',
                        context: { multiple: 3.5, value: 10.499, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('should handle references correctly', (done) => {

            const ref = Joi.ref('a');
            const schema = Joi.object({ a: Joi.number(), b: Joi.number().multiple(ref) });
            Helper.validate(schema, [
                [{ a: 2, b: 32 }, true],
                [{ a: 43, b: 0 }, true],
                [{ a: 4, b: 25 }, false, null, {
                    message: 'child "b" fails because ["b" must be a multiple of ref:a]',
                    details: [{
                        message: '"b" must be a multiple of ref:a',
                        path: ['b'],
                        type: 'number.multiple',
                        context: { multiple: ref, value: 25, label: 'b', key: 'b' }
                    }]
                }],
                [{ a: 0, b: 31 }, false, null, {
                    message: 'child "b" fails because ["b" must be a multiple of ref:a]',
                    details: [{
                        message: '"b" must be a multiple of ref:a',
                        path: ['b'],
                        type: 'number.multiple',
                        context: { multiple: ref, value: 31, label: 'b', key: 'b' }
                    }]
                }],
                [{ a: 0, b: 0 }, false, null, {
                    message: 'child "b" fails because ["b" must be a multiple of ref:a]',
                    details: [{
                        message: '"b" must be a multiple of ref:a',
                        path: ['b'],
                        type: 'number.multiple',
                        context: { multiple: ref, value: 0, label: 'b', key: 'b' }
                    }]
                }]
            ], done);
        });

        it('should handle references correctly within a when', (done) => {

            const schema = Joi.object({
                a: Joi.number().required(),
                b: Joi.number().required(),
                c: Joi.number().required().when('a', {
                    is: Joi.number().multiple(Joi.ref('b')), // a % b === 0
                    then: Joi.number().valid(0)
                })
            });

            Helper.validate(schema, [
                [{ a: 2, b: 3, c: 42 }, true],
                [{ a: 2, b: 4, c: 42 }, true],
                [{ a: 4, b: 2, c: 0 }, true],
                [{ a: 4, b: 2, c: 42 }, false, null, {
                    message: 'child "c" fails because ["c" must be one of [0]]',
                    details: [{
                        message: '"c" must be one of [0]',
                        path: ['c'],
                        type: 'any.allowOnly',
                        context: { valids: [0], label: 'c', key: 'c' }
                    }]
                }]
            ], done);
        });

        it('should handle non-number references correctly', (done) => {

            const schema = Joi.object({ a: Joi.string(), b: Joi.number().multiple(Joi.ref('a')) });
            Helper.validate(schema, [
                [{ a: 'test', b: 32 }, false, null, {
                    message: 'child "b" fails because ["b" references "a" which is not a number]',
                    details: [{
                        message: '"b" references "a" which is not a number',
                        path: ['b'],
                        type: 'number.ref',
                        context: { ref: 'a', label: 'b', key: 'b' }
                    }]
                }],
                [{ a: 'test', b: 0 }, false, null, {
                    message: 'child "b" fails because ["b" references "a" which is not a number]',
                    details: [{
                        message: '"b" references "a" which is not a number',
                        path: ['b'],
                        type: 'number.ref',
                        context: { ref: 'a', label: 'b', key: 'b' }
                    }]
                }],
                [{ a: 'test', b: NaN }, false, null, {
                    message: 'child "b" fails because ["b" must be a number]',
                    details: [{
                        message: '"b" must be a number',
                        path: ['b'],
                        type: 'number.base',
                        context: { label: 'b', key: 'b' }
                    }]
                }]
            ], done);
        });

        it('should handle context references correctly', (done) => {

            const ref = Joi.ref('$a');
            const schema = Joi.object({ b: Joi.number().multiple(ref) });
            Helper.validate(schema, [
                [{ b: 32 }, true, { context: { a: 2 } }],
                [{ b: 0 }, true, { context: { a: 43 } }],
                [{ b: 25 }, false, { context: { a: 4 } }, {
                    message: 'child "b" fails because ["b" must be a multiple of context:a]',
                    details: [{
                        message: '"b" must be a multiple of context:a',
                        path: ['b'],
                        type: 'number.multiple',
                        context: { multiple: ref, value: 25, label: 'b', key: 'b' }
                    }]
                }],
                [{ b: 31 }, false, { context: { a: 0 } }, {
                    message: 'child "b" fails because ["b" must be a multiple of context:a]',
                    details: [{
                        message: '"b" must be a multiple of context:a',
                        path: ['b'],
                        type: 'number.multiple',
                        context: { multiple: ref, value: 31, label: 'b', key: 'b' }
                    }]
                }],
                [{ b: 0 }, false, { context: { a: 0 } }, {
                    message: 'child "b" fails because ["b" must be a multiple of context:a]',
                    details: [{
                        message: '"b" must be a multiple of context:a',
                        path: ['b'],
                        type: 'number.multiple',
                        context: { multiple: ref, value: 0, label: 'b', key: 'b' }
                    }]
                }],
                [{ b: 32 }, false, { context: { a: 'test' } }, {
                    message: 'child "b" fails because ["b" references "a" which is not a number]',
                    details: [{
                        message: '"b" references "a" which is not a number',
                        path: ['b'],
                        type: 'number.ref',
                        context: { ref: 'a', label: 'b', key: 'b' }
                    }]
                }],
                [{ b: 0 }, false, { context: { a: 'test' } }, {
                    message: 'child "b" fails because ["b" references "a" which is not a number]',
                    details: [{
                        message: '"b" references "a" which is not a number',
                        path: ['b'],
                        type: 'number.ref',
                        context: { ref: 'a', label: 'b', key: 'b' }
                    }]
                }],
                [{ b: 0 }, false, { context: { a: NaN } }, {
                    message: 'child "b" fails because ["b" references "a" which is not a number]',
                    details: [{
                        message: '"b" references "a" which is not a number',
                        path: ['b'],
                        type: 'number.ref',
                        context: { ref: 'a', label: 'b', key: 'b' }
                    }]
                }]
            ], done);
        });
    });
});
