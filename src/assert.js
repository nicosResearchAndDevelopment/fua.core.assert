const util = require('./util.js');

/**
 * @param {unknown} value
 * @param {string} [errMsg='']
 * @param {typeof Error} [ErrType=Error]
 * @returns {asserts value}
 */
const assert = function (value, errMsg = '', ErrType = Error) {
    if (!value) util.throwError(assert, ErrType, errMsg);
};

/**
 * @param {unknown} value
 * @returns {asserts value is !undefined}
 */
assert.defined = function (value) {
    if (typeof value === 'undefined') util.throwError(assert.defined, TypeError, 'expected to be defined');
};

/**
 * @param {unknown} value
 * @returns {asserts value is boolean}
 */
assert.boolean = function (value) {
    if (typeof value !== 'boolean') util.throwError(assert.number, TypeError, 'expected to be a boolean');
};

/**
 * @param {unknown} value
 * @param {number} [min=-Infinity]
 * @param {number} [max=Infinity]
 * @returns {asserts value is number}
 */
assert.number = function (value, min = -Infinity, max = Infinity) {
    if (typeof value !== 'number') util.throwError(assert.number, TypeError, 'expected to be a number');
    if (value < min) util.throwError(assert.number, Error, 'expected to be at minimum ' + min);
    if (value > max) util.throwError(assert.number, Error, 'expected to be at maximum ' + max);
};

/**
 * @param {unknown} value
 * @param {number} [min=Number.MIN_SAFE_INTEGER]
 * @param {number} [max=Number.MAX_SAFE_INTEGER]
 * @returns {asserts value is number}
 */
assert.number.integer = function (value, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
    if (typeof value !== 'number') util.throwError(assert.number.integer, TypeError, 'expected to be a number');
    if (!Number.isInteger(value)) util.throwError(assert.number.integer, TypeError, 'expected to be an integer');
    if (value < min) util.throwError(assert.number.integer, Error, 'expected to be at minimum ' + min);
    if (value > max) util.throwError(assert.number.integer, Error, 'expected to be at maximum ' + max);
};

/**
 * @param {unknown} value
 * @param {RegExp} [pattern]
 * @param {number} [min=0]
 * @param {number} [max=Number.MAX_SAFE_INTEGER]
 * @returns {asserts value is string}
 */
assert.string = function (value, pattern, min = 0, max = Number.MAX_SAFE_INTEGER) {
    if (typeof value !== 'string') util.throwError(assert.string, TypeError, 'expected to be a string');
    if (pattern && !pattern.test(value)) util.throwError(assert.string, Error, 'expected to match pattern ' + pattern);
    if (min === max) {
        if (value.length !== min) util.throwError(assert.string, Error, 'expected to have length of ' + min);
    } else {
        if (value.length < min) util.throwError(assert.string, Error, 'expected to have minimum length of ' + min);
        if (value.length > max) util.throwError(assert.string, Error, 'expected to have maximum length of ' + max);
    }
};

const identifierStringPattern = /^\S+$/;

/**
 * @param {unknown} value
 * @param {RegExp} [pattern]
 * @returns {asserts value is string}
 */
assert.string.identifier = function (value, pattern) {
    if (typeof value !== 'string') util.throwError(assert.string.identifier, TypeError, 'expected to be a string');
    if (!identifierStringPattern.test(value)) util.throwError(assert.string.identifier, TypeError, 'expected to be an identifier');
    if (pattern && !pattern.test(value)) util.throwError(assert.string.identifier, Error, 'expected to match pattern ' + pattern);
};

/**
 * @param {unknown} value
 * @returns {asserts value is function}
 */
assert.function = function (value) {
    if (typeof value !== 'function') util.throwError(assert.function, TypeError, 'expected to be a function');
};

/**
 * @param {unknown} value
 * @param {{[key: string]: (value: unknown, key: string) => boolean} | function (value: unknown, key: string): boolean} [checkObj]
 * @returns {asserts value is object}
 */
assert.object = function (value, checkObj) {
    if (!value || typeof value !== 'object') util.throwError(assert.object, TypeError, 'expected to be an object');
    if (checkObj) {
        const fnCheck = typeof checkObj === 'function';
        const keys    = fnCheck ? Object.keys(value) : Object.keys(checkObj);
        for (const key of keys) {
            const checkFn = fnCheck ? checkObj : checkObj[key];
            if (!checkFn(value[key], key)) util.throwError(assert.object, Error, 'expected entry "' + key + '" is invalid');
        }
    }
};

/**
 * @param {unknown} value
 * @param {...Function} classFns
 * @returns {asserts value is object}
 */
assert.instance = function (value, ...classFns) {
    if (!classFns.some(classFn => value instanceof classFn))
        util.throwError(assert.instance, TypeError, 'expected to be instance of ' + classFns.map(classFn => classFn.name).join(' or '));
};

/**
 * @param {unknown} value
 * @param {(value: unknown, index: number) => boolean} [checkFn]
 * @param {number} [min=0]
 * @param {number} [max=Number.MAX_SAFE_INTEGER]
 */
assert.array = function (value, checkFn, min = 0, max = Number.MAX_SAFE_INTEGER) {
    if (!Array.isArray(value)) util.throwError(assert.array, TypeError, 'expected to be an array')
    if (checkFn) for (let i = 0; i < value.length; i++) {
        if (!checkFn(value[i], i)) util.throwError(assert.array, Error, 'expected entry [' + i + '] is invalid');
    }
    if (min === max) {
        if (value.length !== min) util.throwError(assert.array, Error, 'expected to have length of ' + min);
    } else {
        if (value.length < min) util.throwError(assert.array, Error, 'expected to have minimum length of ' + min);
        if (value.length > max) util.throwError(assert.array, Error, 'expected to have maximum length of ' + max);
    }
};

class ToDoError extends Error {
    name = 'TODO';
}

assert.todo = function (errMsg = 'not implemented') {
    util.throwError(assert.todo, ToDoError, errMsg);
};

util.sealModule(assert);
module.exports = assert;
