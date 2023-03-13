declare module "util" {
    /**
     * @template {typeof Error} ErrType
     * @param {Function} source
     * @param {typeof ErrType} ErrType
     * @param {...any} args
     * @throws {ErrType}
     */
    export function throwError<ErrType extends ErrorConstructor>(source: Function, ErrType: any, ...args: any[]): never;
    export function sealModule(target: any): void;
}
declare module "assert" {
    export = assert;
    /**
     * @param {unknown} value
     * @param {string} [errMsg='']
     * @param {typeof Error} [ErrType=Error]
     * @returns {asserts value}
     */
    function assert(value: unknown, errMsg?: string, ErrType?: typeof Error): asserts value;
    namespace assert {
        /**
         * @param {unknown} value
         * @returns {asserts value is !undefined}
         */
        export function defined(value: unknown): asserts value is undefined;
        /**
         * @param {unknown} value
         * @returns {asserts value is boolean}
         */
        export function boolean(value: unknown): asserts value is boolean;
        /**
         * @param {unknown} value
         * @param {number} [min=-Infinity]
         * @param {number} [max=Infinity]
         * @returns {asserts value is number}
         */
        export function number(value: unknown, min?: number, max?: number): asserts value is number;
        export namespace number {
            /**
             * @param {unknown} value
             * @param {number} [min=Number.MIN_SAFE_INTEGER]
             * @param {number} [max=Number.MAX_SAFE_INTEGER]
             * @returns {asserts value is number}
             */
            function integer(value: unknown, min?: number, max?: number): asserts value is number;
        }
        /**
         * @param {unknown} value
         * @param {RegExp} [pattern]
         * @param {number} [min=0]
         * @param {number} [max=Number.MAX_SAFE_INTEGER]
         * @returns {asserts value is string}
         */
        export function string(value: unknown, pattern?: RegExp, min?: number, max?: number): asserts value is string;
        export namespace string {
            /**
             * @param {unknown} value
             * @param {RegExp} [pattern]
             * @returns {asserts value is string}
             */
            function identifier(value: unknown, pattern?: RegExp): asserts value is string;
        }
        /**
         * @param {unknown} value
         * @returns {asserts value is function}
         */
        function _function(value: unknown): asserts value is Function;
        export { _function as function };
        /**
         * @param {unknown} value
         * @param {{[key: string]: (value: unknown, key: string) => boolean}} [checkObj]
         * @returns {asserts value is object}
         */
        export function object(value: unknown, checkObj?: {
            [key: string]: (value: unknown, key: string) => boolean;
        }): asserts value is any;
        /**
         * @param {unknown} value
         * @param {...Function} classFns
         * @returns {asserts value is object}
         */
        export function instance(value: unknown, ...classFns: Function[]): asserts value is any;
        /**
         * @param {unknown} value
         * @param {(value: unknown, index: number) => boolean} [checkFn]
         * @param {number} [min=0]
         * @param {number} [max=Number.MAX_SAFE_INTEGER]
         */
        export function array(value: unknown, checkFn?: (value: unknown, index: number) => boolean, min?: number, max?: number): void;
        export function todo(errMsg?: string): void;
    }
}
