"use client";

import { useCallback, useSyncExternalStore } from "react";
import { persistLikedIds, readLikedIds } from "@/lib/likes";

const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function snapshotFor(id: string): boolean {
  return readLikedIds().has(id);
}

export function useLikes(id: string, baseCount: number) {
  const liked = useSyncExternalStore(
    subscribe,
    () => snapshotFor(id),
    () => false,
  );

  const toggle = useCallback(() => {
    const ids = readLikedIds();
    if (ids.has(id)) {
      ids.delete(id);
    } else {
      ids.add(id);
    }
    persistLikedIds(ids);
    emit();
  }, [id]);

  return {
    liked,
    count: baseCount + (liked ? 1 : 0),
    toggle,
  };
}
