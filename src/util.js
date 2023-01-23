/**
 * @template {typeof Error} ErrType
 * @param {Function} source
 * @param {typeof ErrType} ErrType
 * @param {...any} args
 * @throws {ErrType}
 */
exports.throwError = function throwError(source, ErrType, ...args) {
    const err = new ErrType(...args);
    Error.captureStackTrace(err, source);
    throw err;
};

exports.sealModule = function sealModule(target) {
    Object.freeze(target);
    for (const child of Object.values(target)) {
        if (child instanceof Object) sealModule(child);
    }
};
