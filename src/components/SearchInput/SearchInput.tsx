import React from 'react';
import './SearchInput.css';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  isCompact?: boolean;
}

const CHARACTER_LIMIT = 120;

export const SearchInput: React.FC<SearchInputProps> = ({ 
  value, 
  onChange, 
  onSubmit, 
  loading, 
  isCompact = false 
}) => {
  const handleChange = (newValue: string) => {
    if (newValue.length <= CHARACTER_LIMIT) {
      onChange(newValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim() && value.length <= CHARACTER_LIMIT) {
      onSubmit();
    }
  };

  const handleSubmit = () => {
    if (value.trim() && value.length <= CHARACTER_LIMIT) {
      onSubmit();
    }
  };

  const remainingChars = CHARACTER_LIMIT - value.length;
  const isOverLimit = value.length > CHARACTER_LIMIT;

  if (isCompact) {
    return (
      <div className="compact-search">
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter a sentence to analyze..."
        />
        <button onClick={handleSubmit} disabled={loading || !value.trim() || isOverLimit}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
        <div className="character-counter">
          <span className={remainingChars < 20 ? 'warning' : ''}>
            {remainingChars} chars remaining
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-search">
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Enter an English sentence to analyze its linguistic DNA..."
      />
      <button onClick={handleSubmit} disabled={loading || !value.trim() || isOverLimit}>
        {loading ? 'Analyzing Linguistic DNA...' : 'Analyze Sentence'}
      </button>
      <div className="character-counter">
        <span className={remainingChars < 20 ? 'warning' : ''}>
          {remainingChars} characters remaining
        </span>
      </div>
    </div>
  );
};