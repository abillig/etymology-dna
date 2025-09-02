import React from 'react';
import './SearchInput.css';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  isCompact?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({ 
  value, 
  onChange, 
  onSubmit, 
  loading, 
  isCompact = false 
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  if (isCompact) {
    return (
      <div className="compact-search">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter a sentence to analyze..."
        />
        <button onClick={onSubmit} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
    );
  }

  return (
    <div className="hero-search">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Enter an English sentence to analyze its linguistic DNA..."
      />
      <button onClick={onSubmit} disabled={loading}>
        {loading ? 'Analyzing Linguistic DNA...' : 'Analyze Sentence'}
      </button>
    </div>
  );
};