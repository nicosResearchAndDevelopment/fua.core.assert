const util = {
    isNull:          (value) => (value ?? null) === null,
    isArray:         (value) => Array.isArray(value),
    isRegExp:        (value) => value instanceof RegExp,
    isFunction:      (value) => typeof value === 'function',
    isFunctionArray: (value) => util.isArray(value) && value.every(util.isFunction),
    Datatypes:       ['undefined', 'boolean', 'number', 'bigint', 'string', 'symbol', 'object', 'function'],
    isDatatype:      (value) => util.Datatypes.includes(value),
    isString:        (value) => typeof value === 'string',
    isBoolean:       (value) => typeof value === 'boolean'
};

// TODO rethink and maybe rework, if there is a better approach

/**
 * @param {function (value: unknown): boolean} checker
 * @returns {function (value: unknown): boolean}
 */
const validator = function (checker) {
    if (!util.isFunction(checker) || !util.isBoolean(checker())) throw new Error('invalid checker');
    return (value) => checker(value);
};

/**
 * @template {string} T
 * @param {RegExp} pattern
 * @returns {function (value: unknown): value is T}
 */
validator.string = function (pattern) {
    if (!util.isRegExp(pattern)) throw new Error('invalid pattern');
    return (value) => util.isString(value) && pattern.test(value);
};

/**
 * @template {Array<V>} T
 * @template {any} V
 * @param {function (value: unknown): value is V} checker
 * @returns {function (value: unknown): value is T}
 */
validator.array = function (checker) {
    if (!util.isFunction(checker)) throw new Error('invalid checker');
    return (value) => util.isArray(value) && value.every(checker);
};

/**
 * @template {any} T
 * @param {Array<T>} choices
 * @returns {function (value: unknown): value is T}
 */
validator.enum = function (choices) {
    if (!util.isArray(choices)) throw new Error('invalid choices');
    return (value) => choices.includes(value);
};

/**
 * @template {Object} T
 * @param {typeof T} classFunction
 * @returns {function(value: unknown): value is T}
 */
validator.instance = function (classFunction) {
    if (!util.isFunction(classFunction)) throw new Error('invalid classFunction');
    return (value) => value instanceof classFunction;
};

/**
 * @template {any} T
 * @param {typeof T} datatype
 * @returns {function(value: unknown): value is T}
 */
validator.datatype = function (datatype) {
    if (!util.isDatatype(datatype)) throw new Error('invalid datatype');
    return (value) => typeof value === datatype;
};

/**
 * @template {any} T
 * @param {Array<function (value: unknown): value is T>} concatenations
 * @returns {function(value: unknown): value is T}
 */
validator.concatenation = function (concatenations) {
    if (!util.isFunctionArray(concatenations)) throw new Error('invalid concatenations');
    return (value) => concatenations.every(validator => validator(value));
};

/**
 * @template {any} T
 * @param {Array<function (value: unknown): value is T>} alternatives
 * @returns {function(value: unknown): value is T}
 */
validator.alternative = function (alternatives) {
    if (!util.isFunctionArray(alternatives)) throw new Error('invalid alternatives');
    return (value) => alternatives.some(validator => validator(value));
};

/**
 * @template {any} T
 * @param {function (value: unknown): value is T} checker
 * @returns {function(value: unknown): value is (null | T)}
 */
validator.optional = function (checker) {
    if (!util.isFunction(checker)) throw new Error('invalid checker');
    return (value) => util.isNull(value) || checker(value);
};

module.exports = validator;
