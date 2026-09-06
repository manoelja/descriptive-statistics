import { useState, useEffect, useRef } from 'react';

export function useTypewriter(words: string[], speed = 100, pause = 2000): string {
  const [text, setText] = useState('');
  const indexRef = useRef(0);
  const deletingRef = useRef(false);
  const textRef = useRef('');

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const currentWord = words[indexRef.current] ?? '';
      const currentText = textRef.current;

      if (!deletingRef.current && currentText === currentWord) {
        timeout = setTimeout(() => {
          deletingRef.current = true;
          tick();
        }, pause);
        return;
      }

      if (deletingRef.current && currentText === '') {
        deletingRef.current = false;
        indexRef.current = (indexRef.current + 1) % words.length;
        timeout = setTimeout(tick, speed);
        return;
      }

      const nextText = deletingRef.current
        ? currentWord.substring(0, currentText.length - 1)
        : currentWord.substring(0, currentText.length + 1);

      textRef.current = nextText;
      setText(nextText);

      if (!deletingRef.current && nextText.length >= currentWord.length) {
        deletingRef.current = true;
      }

      timeout = setTimeout(tick, deletingRef.current ? speed / 2 : speed);
    };

    tick();
    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, speed, pause]);

  return text;
}
