import { basename, extname, join, normalize, resolve } from './path-utils'

// Test extname
console.assert(extname('file.txt') === '.txt', 'extname test 1 failed')
console.assert(extname('file.min.js') === '.js', 'extname test 2 failed')
console.assert(extname('file') === '', 'extname test 3 failed')

// Test basename
console.assert(basename('/path/to/file.txt') === 'file.txt', 'basename test 1 failed')
console.assert(basename('file.txt') === 'file.txt', 'basename test 2 failed')
console.assert(basename('\\path\\to\\file.txt') === 'file.txt', 'basename test 3 failed')

// Test join
console.assert(join('a', 'b', 'c') === 'a/b/c', 'join test 1 failed')
console.assert(join('/root', 'sub') === '/root/sub', 'join test 2 failed')
console.assert(join('a/', '/b') === 'a/b', 'join test 3 failed')

// Test normalize
console.assert(normalize('a/./b/../c') === 'a/c', 'normalize test 1 failed')
console.assert(normalize('a//b//c') === 'a/b/c', 'normalize test 2 failed')
console.assert(normalize('a\\b\\c') === 'a/b/c', 'normalize test 3 failed')

// Test resolve
console.assert(resolve('/base', 'relative') === '/base/relative', 'resolve test 1 failed')
console.assert(resolve('/base', '/absolute') === '/absolute', 'resolve test 2 failed')

console.log('All path utility tests passed!')