import React from 'react';
import { WordOrigin } from '../../types';
import './SentenceDisplay.css';

interface SentenceDisplayProps {
  words: WordOrigin[];
  onWordHover: (word: WordOrigin | null) => void;
}

export const SentenceDisplay: React.FC<SentenceDisplayProps> = ({ words, onWordHover }) => {
  return (
    <div className="sentence-display">
      <h3>Sentence Analysis</h3>
      <p>Hover over a word to learn more.</p>
      <div className="colored-sentence">
        {words.map((word, index) => (
          <span
            key={index}
            className="colored-word"
            style={{ color: word.color }}
            onMouseEnter={() => onWordHover(word)}
            onMouseLeave={() => onWordHover(null)}
          >
            {word.word}
            {index < words.length - 1 && ' '}
          </span>
        ))}
      </div>
    </div>
  );
};