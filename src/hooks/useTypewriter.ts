import { useState, useEffect } from 'react';

// Vrai si l'animation doit être sautée : préférence utilisateur pour moins de
// mouvement, ou navigateur piloté (pré-rendu Puppeteer en CI) qui capturerait
// sinon un titre tronqué dans le HTML statique.
const shouldSkipAnimation = (): boolean => {
  if (typeof window === 'undefined') return true;
  if (typeof navigator !== 'undefined' && navigator.webdriver) return true;
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
};

export const useTypewriter = (text: string, speed: number = 100, enabled: boolean = true) => {
  const [active] = useState(() => enabled && !shouldSkipAnimation());
  const [displayedText, setDisplayedText] = useState(active ? '' : text);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Texte complet immédiatement si l'animation est désactivée ou sautée
    if (!active || !enabled) {
      setDisplayedText(text);
      return;
    }

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed, enabled, active]);

  return displayedText;
};
