'use client';

import { useSyncExternalStore } from 'react';

export interface Toast {
  id: number;
  message: string;
  description?: string;
  tone: 'success' | 'error' | 'info';
}

const EMPTY_TOASTS: Toast[] = [];
let toasts: Toast[] = EMPTY_TOASTS;
let nextId = 1;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function dismissToast(id: number) {
  toasts = toasts.filter((toast) => toast.id !== id);
  notify();
}

export function showToast(message: string, options?: { description?: string; tone?: Toast['tone']; duration?: number }) {
  const id = nextId++;
  toasts = [...toasts, { id, message, description: options?.description, tone: options?.tone ?? 'success' }];
  notify();
  const duration = options?.duration ?? 4500;
  if (typeof window !== 'undefined') setTimeout(() => dismissToast(id), duration);
  return id;
}

export function useToasts(): Toast[] {
  return useSyncExternalStore(subscribe, () => toasts, () => EMPTY_TOASTS);
}
