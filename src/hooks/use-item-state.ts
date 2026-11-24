import { useCallback, useState } from "react";

export type ItemStateMap<T extends object> = Map<string, T>;

export const useItemState = <
  T extends object = {
    message?: string;
    error?: string;
    isLoading?: boolean;
    isSuccess?: boolean;
  },
>() => {
  const [stateMap, setStateMap] = useState<ItemStateMap<T>>(() => new Map());

  // Get toàn bộ state
  const getState = useCallback(
    (key: string): T | undefined => {
      return stateMap.get(key);
    },
    [stateMap],
  );

  // Set hoặc merge state
  const setState = useCallback((key: string, state: Partial<T>) => {
    setStateMap((prev) => {
      const next = new Map(prev);

      next.set(key, {
        ...next.get(key),
        ...state,
      } as T);

      return next;
    });
  }, []);

  // Update state dựa trên state hiện tại
  const updateState = useCallback(
    (key: string, updater: (current: T | undefined) => T) => {
      setStateMap((prev) => {
        const next = new Map(prev);
        next.set(key, updater(next.get(key)));
        return next;
      });
    },
    [],
  );

  // Get một thuộc tính cụ thể
  const getValue = useCallback(
    <K extends keyof T>(key: string, field: K): T[K] | undefined => {
      return stateMap.get(key)?.[field];
    },
    [stateMap],
  );

  const setValue = useCallback(
    <K extends keyof T>(key: string, field: K, value: T[K]) => {
      setStateMap((prev) => {
        const next = new Map(prev);

        const current = next.get(key) ?? ({} as T);

        next.set(key, {
          ...current,
          [field]: value,
        });

        return next;
      });
    },
    [],
  );

  // Set message
  const setMessage = useCallback(
    (key: string, message: string) => {
      setValue(key, "message" as keyof T, message as T[keyof T]);
    },
    [setValue],
  );

  // Remove một item
  const removeState = useCallback((key: string) => {
    setStateMap((prev) => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  }, []);

  // Reset toàn bộ state
  const resetAll = useCallback(() => {
    setStateMap(new Map());
  }, []);

  // Kiểm tra item có tồn tại hay không
  const hasState = useCallback((key: string) => stateMap.has(key), [stateMap]);

  return {
    stateMap,
    getState,
    setState,
    updateState,
    getValue,
    setValue,
    setMessage,
    removeState,
    resetAll,
    hasState,
  };
};
