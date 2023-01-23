/**
 * @param {unknown} value
 * @param {string} [errMsg='']
 * @param {typeof Error} [ErrType=Error]
 * @returns {asserts value}
 */
const assert = function assert(value, errMsg = '', ErrType = Error) {
    if (!value) _throwErr(assert, ErrType, errMsg);
};

/**
 * @param {unknown} value
 * @returns {asserts value is boolean}
 */
assert.boolean = function assertBoolean(value) {
    if (typeof value !== 'boolean') _throwErr(assert.number, TypeError, 'expected to be a boolean');
};

/**
 * @param {unknown} value
 * @param {number} [min=-Infinity]
 * @param {number} [max=Infinity]
 * @returns {asserts value is number}
 */
assert.number = function assertNumber(value, min = -Infinity, max = Infinity) {
    if (typeof value !== 'number') _throwErr(assert.number, TypeError, 'expected to be a number');
    if (value < min) _throwErr(assert.number, Error, 'expected to be at minimum ' + min);
    if (value > max) _throwErr(assert.number, Error, 'expected to be at maximum ' + max);
};

/**
 * @param {unknown} value
 * @param {number} [min=Number.MIN_SAFE_INTEGER]
 * @param {number} [max=Number.MAX_SAFE_INTEGER]
 * @returns {asserts value is number}
 */
assert.number.integer = function assertInteger(value, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
    if (typeof value !== 'number') _throwErr(assert.number.integer, TypeError, 'expected to be a number');
    if (!Number.isInteger(value)) _throwErr(assert.number.integer, TypeError, 'expected to be an integer');
    if (value < min) _throwErr(assert.number.integer, Error, 'expected to be at minimum ' + min);
    if (value > max) _throwErr(assert.number.integer, Error, 'expected to be at maximum ' + max);
};

/**
 * @param {unknown} value
 * @param {RegExp} [pattern]
 * @param {number} [min=0]
 * @param {number} [max=Number.MAX_SAFE_INTEGER]
 * @returns {asserts value is string}
 */
assert.string = function assertString(value, pattern, min = 0, max = Number.MAX_SAFE_INTEGER) {
    if (typeof value !== 'string') _throwErr(assert.string, TypeError, 'expected to be a string');
    if (pattern && !pattern.test(value)) _throwErr(assert.string, Error, 'expected to match pattern ' + pattern);
    if (value.length < min) _throwErr(assert.string, Error, 'expected to have minimum length of ' + min);
    if (value > max) _throwErr(assert.string, Error, 'expected to have maximum length of ' + max);
};

/**
 * @param {unknown} value
 * @returns {asserts value is function}
 */
assert.function = function assertFunction(value) {
    if (typeof value !== 'function') _throwErr(assert.function, TypeError, 'expected to be a function');
};

/**
 * @param {unknown} value
 * @param {{[key: string]: (value: unknown, key: string) => boolean}} [checkObj]
 * @returns {asserts value is object}
 */
assert.object = function assertObject(value, checkObj) {
    if (value && typeof value !== 'object') _throwErr(assert.object, TypeError, 'expected to be an object');
    if (checkObj) {
        for (const [key, checkFn] of Object.entries(checkObj)) {
            if (!checkFn(value[key], key)) _throwErr(assert.object, Error, 'expected entry "' + key + '" is invalid');
        }
    }
};

/**
 * @param {unknown} value
 * @param {...Function} classFns
 * @returns {asserts value is object}
 */
assert.instance = function assertInstance(value, ...classFns) {
    if (!classFns.some(classFn => value instanceof classFn))
        _throwErr(assert.instance, TypeError, 'expected to be instance of ' + classFns.map(classFn => classFn.name).join(' or '));
};

/**
 * @param {unknown} value
 * @param {(value: unknown, index: number) => boolean} [checkFn]
 * @param {number} [min=0]
 * @param {number} [max=Number.MAX_SAFE_INTEGER]
 */
assert.array = function assertArray(value, checkFn, min = 0, max = Number.MAX_SAFE_INTEGER) {
    if (!Array.isArray(value)) _throwErr(assert.array, TypeError, 'expected to be an array')
    if (checkFn) for (let i = 0; i < value.length; i++) {
        if (!checkFn(value[i], i)) _throwErr(assert.array, Error, 'expected entry [' + i + '] is invalid');
    }
    if (value.length < min) _throwErr(assert.array, Error, 'expected to have minimum length of ' + min);
    if (value > max) _throwErr(assert.array, Error, 'expected to have maximum length of ' + max);
};

/**
 * @param {Function} source
 * @param {typeof Error} ErrType
 * @param {...any} args
 * @throws {ErrType}
 * @private
 */
function _throwErr(source, ErrType, ...args) {
    const err = new ErrType(...args);
    Error.captureStackTrace(err, source);
    throw err;
}

module.exports = assert;

(function seal(target) {
    Object.freeze(target);
    for (const child of Object.values(target)) {
        if (child instanceof Object) seal(child);
    }
})(module.exports);
