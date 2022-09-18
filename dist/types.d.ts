/**
 * Defines a string dictionary.
 */
export interface IStringDictionary<T> {
    [index: string]: T;
}
/**
 * Defines a number dictionary.
 */
export interface INumberDictionary<T> {
    [index: number]: T;
}
/**
 * Defines a member that can have a value or be null.
 */
export declare type Nullable<T> = null | T;
/**
 * Defines a member that can have a value or be undefined.
 */
export declare type Undefinable<T> = undefined | T;
