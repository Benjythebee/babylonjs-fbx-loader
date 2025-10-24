/**
 * Browser-friendly path utilities to replace Node.js 'path' module
 */
/**
 * Extracts the file extension from a file path
 * @param filePath The file path
 * @returns The extension including the dot (e.g., '.png', '.jpg')
 */
export declare function extname(filePath: string): string;
/**
 * Extracts the base name (filename) from a file path
 * @param filePath The file path
 * @returns The filename with extension
 */
export declare function basename(filePath: string): string;
/**
 * Joins path segments together using forward slashes
 * @param paths Path segments to join
 * @returns The joined path
 */
export declare function join(...paths: string[]): string;
/**
 * Normalizes a path by resolving '..' and '.' segments and standardizing slashes
 * @param filePath The path to normalize
 * @returns The normalized path
 */
export declare function normalize(filePath: string): string;
/**
 * Resolves a path relative to a base path (browser-friendly version)
 * Note: This is a simplified version for browser use cases
 * @param base The base path
 * @param relativePath The relative path to resolve
 * @returns The resolved path
 */
export declare function resolve(base: string, relativePath?: string): string;
