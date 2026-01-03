import { useState, useEffect } from 'react';

export const useTypewriter = (text: string, speed: number = 100, enabled: boolean = true) => {
  // If disabled, return full text immediately without any animation
  const [displayedText, setDisplayedText] = useState(enabled ? '' : text);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Skip animation entirely if disabled
    if (!enabled) {
      setDisplayedText(text);
      return;
    }

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed, enabled]);

  return displayedText;
};
