const util = exports;

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
