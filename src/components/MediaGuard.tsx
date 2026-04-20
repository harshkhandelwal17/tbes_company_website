'use client';

import { useEffect } from 'react';

/**
 * MediaGuard — globally blocks keyboard shortcuts that expose raw media files.
 * Place this once in the root layout. Zero UI, zero render output.
 */
export default function MediaGuard() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      // Ctrl+S  → Save page (would cache media)
      // Ctrl+U  → View page source
      if (ctrl && (key === 's' || key === 'u')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, []);

  return null;
}
