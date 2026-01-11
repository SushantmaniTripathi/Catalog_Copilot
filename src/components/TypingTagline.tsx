import { useState, useEffect } from 'react';

const words = ['Speak.', 'Snap.', 'Sell.'];

export const TypingTagline = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isComplete) return;

    const currentWord = words[wordIndex];
    
    if (charIndex < currentWord.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + currentWord[charIndex]);
        setCharIndex(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else if (wordIndex < words.length - 1) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + ' ');
        setWordIndex(prev => prev + 1);
        setCharIndex(0);
      }, 200);
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [charIndex, wordIndex, isComplete]);

  return (
    <h2 className="text-2xl font-bold">
      {displayedText}
      <span 
        className={`inline-block w-0.5 h-6 bg-primary ml-1 align-middle ${
          isComplete ? 'animate-pulse' : 'animate-[blink_0.7s_infinite]'
        }`}
      />
    </h2>
  );
};
