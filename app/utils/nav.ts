export function isNavItemActive(currentPath: string, itemPath: string): boolean {
  if (itemPath === '/dashboard') {
    return currentPath === '/dashboard' || currentPath === '/'
  }
  return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`)
}
