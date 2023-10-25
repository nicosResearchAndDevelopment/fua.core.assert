const util = exports;

const _datatypes = ['undefined', 'boolean', 'number', 'bigint', 'string', 'symbol', 'object', 'function'];

util.isNull          = (value) => (value ?? null) === null;
util.isArray         = (value) => Array.isArray(value);
util.isRegExp        = (value) => value instanceof RegExp;
util.isFunction      = (value) => typeof value === 'function';
util.isFunctionArray = (value) => util.isArray(value) && value.every(util.isFunction);
util.isDatatype      = (value) => _datatypes.includes(value);
util.isString        = (value) => typeof value === 'string';
util.isBoolean       = (value) => typeof value === 'boolean';

/**
 * @template {typeof Error} ErrType
 * @param {Function} source
 * @param {typeof ErrType} ErrType
 * @param {...any} args
 * @throws {ErrType}
 */
util.throwError = function (source, ErrType, ...args) {
    const err = new ErrType(...args);
    Error.captureStackTrace(err, source);
    throw err;
};

util.sealModule = function (target) {
    Object.freeze(target);
    for (const child of Object.values(target)) {
        if (child instanceof Object) util.sealModule(child);
    }
};
