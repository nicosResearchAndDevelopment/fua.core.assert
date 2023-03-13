/**
 * @template {typeof Error} ErrType
 * @param {Function} source
 * @param {typeof ErrType} ErrType
 * @param {...any} args
 * @throws {ErrType}
 */
export function throwError<ErrType extends ErrorConstructor>(source: Function, ErrType: any, ...args: any[]): never;
export function sealModule(target: any): void;
