"use client";

import { useEffect } from 'react';
import { toast, useToasterStore } from 'react-hot-toast';

export default function ToastLimit({ limit = 3 }) {
  const { toasts } = useToasterStore();

  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= limit)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts, limit]);

  return null;
}
