const inspector = require('./02_inspector.js');

const validator = function (inspector) {
    return function validate(value) {
        const err = inspector(value);
        if (err) {
            Error.captureStackTrace(err, validate);
            throw err;
        }
    };
};

validator.string = function (pattern, min = 0, max = Number.MAX_SAFE_INTEGER) {
    return validator(inspector.string(pattern, min, max));
};

module.exports = validator;
