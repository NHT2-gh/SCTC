export function diffArray<T extends { id?: string }>({
  initial,
  current,
  dirtyFields,
}: {
  initial: T[];
  current: T[];
  dirtyFields: any[];
}) {
  const upsert: T[] = [];
  const deleted: string[] = [];

  const currentMap = new Map(current.filter((i) => i.id).map((i) => [i.id, i]));

  current.forEach((item, index) => {
    //UPSERT
    const isDirty = dirtyFields?.[index];
    const hasChanged = isDirty && Object.values(isDirty).some(Boolean);
    if (hasChanged) {
      upsert.push(item);
    }
  });

  // DELETE
  initial.forEach((item) => {
    if (item.id && !currentMap.has(item.id)) {
      deleted.push(item.id);
    }
  });

  return { upsert, deleted };
}

export function diffBasicArray<T>(original: T[], current: T[]) {
  const added = current.filter((item) => !original.includes(item));
  const removed = original.filter((item) => !current.includes(item));

  return {
    added,
    removed,
  };
}
