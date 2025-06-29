"use client";

import { cn } from "@/lib/utils";
import { motion, stagger, useAnimate } from "framer-motion";
import { useEffect, useState } from "react";

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  // split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });

  const [scope, animate] = useAnimate();
  useEffect(() => {
    animate(
      "span",
      {
        display: "inline-block",
        opacity: 1,
      },
      {
        duration: 0.0,
        delay: stagger(0.1),
        ease: "easeInOut",
      }
    );
  }, [animate]);

  const renderWords = () => {
    return (
      <motion.div ref={scope} className="inline">
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <motion.span
                  initial={{}}
                  key={`char-${index}`}
                  className={cn(`opacity-0 hidden`, word.className)}
                >
                  {char}
                </motion.span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </motion.div>
    );
  };
  return (
    <div
      className={cn(
        "text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center",
        className
      )}
    >
      {renderWords()}
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "inline-block rounded-sm w-[4px] h-4 md:h-6 lg:h-10 bg-blue-500",
          cursorClassName
        )}
      ></motion.span>
    </div>
  );
};

export const TypewriterEffectSmooth = ({
  words,
  className,
  cursorClassName,
  onComplete,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
  onComplete?: () => void;
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const [displayedText, setDisplayedText] = useState<Array<{text: string; className?: string}>>([]);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  
  useEffect(() => {
    if (currentWordIndex >= words.length && !isComplete) {
      setIsComplete(true);
      if (onComplete) {
        setTimeout(() => {
          onComplete();
        }, 100); // Delay lebih lama agar user bisa melihat hasil akhir
      }
      return;
    }
    
    if (currentWordIndex >= words.length) return;
    
    const currentWord = words[currentWordIndex];
    const timer = setTimeout(() => {
      if (currentCharIndex < currentWord.text.length) {
        // Add character to current word
        setCurrentCharIndex((prev: number) => prev + 1);
      } else {
        // Move to next word - pause sedikit antara kata
        setDisplayedText((prev: Array<{text: string; className?: string}>) => [...prev, {
          text: currentWord.text,
          className: currentWord.className
        }]);
        setCurrentWordIndex((prev: number) => prev + 1);
        setCurrentCharIndex(0);
      }
    }, currentCharIndex < currentWord.text.length ? 55 : 55); 
    
    return () => clearTimeout(timer);
  }, [currentWordIndex, currentCharIndex, words, isComplete, onComplete]);

  const renderDisplayedWords = () => {
    return (
      <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1">
        {displayedText.map((word: {text: string; className?: string}, idx: number) => (
          <motion.span 
            key={`displayed-word-${idx}`} 
            className={cn("text-gray-900", word.className)}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.1 }}
          >
            {word.text}
          </motion.span>
        ))}
        {currentWordIndex < words.length && (
          <span className={cn("text-gray-900", words[currentWordIndex]?.className)}>
            {words[currentWordIndex]?.text.slice(0, currentCharIndex)}
            {/* Cursor yang berkedip saat mengetik dengan efek glow */}
            <motion.span 
              className="inline-block w-[3px] h-[1em] bg-blue-500 ml-1 shadow-lg shadow-blue-500/50"

            />
          </span>
        )}
        {/* Cursor final setelah selesai dengan efek yang lebih dramatis */}
        {currentWordIndex >= words.length && (
          <motion.span
            initial={{ opacity: 0 }}
            className="inline-block w-[3px] h-[1em] bg-blue-500 ml-1 shadow-lg shadow-blue-500/50"
          />
        )}
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col items-center justify-center my-6", className)}>
      <div className="w-full max-h-32 sm:max-h-40 md:max-h-48 lg:max-h-56 overflow-hidden">
        <div className="text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl font-bold leading-tight text-center drop-shadow-sm">
          {renderDisplayedWords()}
        </div>
      </div>
    </div>
  );
};
