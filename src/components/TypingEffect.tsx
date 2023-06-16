import React, { useState, useEffect, useRef } from "react";
import styles from "../pages/index.module.css";

interface TypingEffectProps {
  text: string;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ text }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const delay = 10; // Delay between each character (in milliseconds)

    const typingTimer = setTimeout(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex));
        setCurrentIndex((prevIndex) => prevIndex + 1);
        containerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, delay);

    return () => clearTimeout(typingTimer);
  }, [currentIndex, text]);

  return (
    <div ref={containerRef} className={styles.typingEffectContainer}>
      {displayText}
    </div>
  );
};

export default TypingEffect;
