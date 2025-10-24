/**
 * Browser-friendly path utilities to replace Node.js 'path' module
 */

/**
 * Extracts the file extension from a file path
 * @param filePath The file path
 * @returns The extension including the dot (e.g., '.png', '.jpg')
 */
export function extname(filePath: string): string {
  const lastDotIndex = filePath.lastIndexOf('.')
  if (lastDotIndex === -1 || lastDotIndex === filePath.length - 1) {
    return ''
  }
  return filePath.substring(lastDotIndex)
}

/**
 * Extracts the base name (filename) from a file path
 * @param filePath The file path
 * @returns The filename with extension
 */
export function basename(filePath: string): string {
  const normalizedPath = filePath.replace(/\\/g, '/')
  const lastSlashIndex = normalizedPath.lastIndexOf('/')
  if (lastSlashIndex === -1) {
    return normalizedPath
  }
  return normalizedPath.substring(lastSlashIndex + 1)
}

/**
 * Joins path segments together using forward slashes
 * @param paths Path segments to join
 * @returns The joined path
 */
export function join(...paths: string[]): string {
  if (paths.length === 0) return ''
  
  const filteredPaths = paths.filter(path => path && path.length > 0)
  if (filteredPaths.length === 0) return ''
  
  let joined = filteredPaths.join('/')
  
  // Replace multiple slashes with single slash
  joined = joined.replace(/\/+/g, '/')
  
  // Remove trailing slash unless it's the root
  if (joined.length > 1 && joined.endsWith('/')) {
    joined = joined.slice(0, -1)
  }
  
  return joined
}

/**
 * Normalizes a path by resolving '..' and '.' segments and standardizing slashes
 * @param filePath The path to normalize
 * @returns The normalized path
 */
export function normalize(filePath: string): string {
  if (!filePath) return ''
  
  // Convert backslashes to forward slashes
  let path = filePath.replace(/\\/g, '/')
  
  // Split into segments
  const segments = path.split('/')
  const normalizedSegments: string[] = []
  
  for (const segment of segments) {
    if (segment === '' && normalizedSegments.length > 0) {
      // Skip empty segments unless it's the first one (root)
      continue
    } else if (segment === '.') {
      // Skip current directory references
      continue
    } else if (segment === '..') {
      // Go up one directory
      if (normalizedSegments.length > 0 && normalizedSegments[normalizedSegments.length - 1] !== '..') {
        normalizedSegments.pop()
      } else if (!path.startsWith('/')) {
        // Only add '..' if we're not at an absolute path root
        normalizedSegments.push('..')
      }
    } else {
      normalizedSegments.push(segment)
    }
  }
  
  let result = normalizedSegments.join('/')
  
  // Preserve leading slash for absolute paths
  if (path.startsWith('/') && !result.startsWith('/')) {
    result = '/' + result
  }
  
  return result || '.'
}

/**
 * Resolves a path relative to a base path (browser-friendly version)
 * Note: This is a simplified version for browser use cases
 * @param base The base path
 * @param relativePath The relative path to resolve
 * @returns The resolved path
 */
export function resolve(base: string, relativePath?: string): string {
  if (!relativePath) {
    return normalize(base)
  }
  
  // If relativePath is already absolute (starts with / or has protocol), return as-is
  if (relativePath.startsWith('/') || relativePath.includes('://')) {
    return normalize(relativePath)
  }
  
  // Join and normalize
  return normalize(join(base, relativePath))
}