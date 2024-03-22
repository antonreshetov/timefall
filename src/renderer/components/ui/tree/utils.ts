export function flatToNested<T extends Record<string, any>>(
  items: T[],
  id = '',
  idLink = 'id',
  link = 'parentId',
): T[] {
  return items
    .filter(item => item[link] === id)
    .map(item => ({
      ...item,
      children: flatToNested(items, item[idLink]),
    }))
}
