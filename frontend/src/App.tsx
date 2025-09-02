import React, { useState } from 'react';
import { WordOrigin, EtymologyResponse, OriginPercentage } from './types';
import './App.css';

function App() {
  const [sentence, setSentence] = useState('');
  const [etymologyData, setEtymologyData] = useState<WordOrigin[]>([]);
  const [percentages, setPercentages] = useState<OriginPercentage[]>([]);
  const [loading, setLoading] = useState(false);
  const [hoveredWord, setHoveredWord] = useState<WordOrigin | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const analyzeSentence = async () => {
    if (!sentence.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sentence }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze sentence');
      }

      const data: EtymologyResponse = await response.json();
      setEtymologyData(data.words);
      setPercentages(data.percentages);
      setHasSearched(true);
      setSentence('');
    } catch (error) {
      console.error('Error analyzing sentence:', error);
      alert('Error analyzing sentence. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const renderDNAReport = () => {
    return (
      <div className="dna-report">
        <div className="report-content">
          <div className="ancestry-bars">
            <div className="chromosome-visualization">
              {/* DNA-style horizontal bars */}
              {percentages.map((origin, index) => (
                <div key={index} className="chromosome-bar">
                  <div 
                    className="ancestry-segment"
                    style={{ 
                      width: `${origin.percentage}%`,
                      backgroundColor: origin.color 
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="ancestry-breakdown">
            <h3>Linguistic Composition</h3>
            <div className="breakdown-list">
              {percentages.map((origin, index) => (
                <div key={index} className="breakdown-item">
                  <div className="breakdown-info">
                    <div className="origin-dot" style={{ backgroundColor: origin.color }}></div>
                    <span className="origin-name">{origin.origin}</span>
                  </div>
                  <span className="origin-percentage">{origin.percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSentenceWithColors = () => {
    return (
      <div className="sentence-display">
        <h3>Color-Coded Analysis</h3>
        <div className="colored-sentence">
          {etymologyData.map((word, index) => (
            <span
              key={index}
              className="colored-word"
              style={{ color: word.color }}
              onMouseEnter={() => setHoveredWord(word)}
              onMouseLeave={() => setHoveredWord(null)}
            >
              {word.word}
              {index < etymologyData.length - 1 && ' '}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`app ${hasSearched ? 'searched' : 'initial'}`}>
      {!hasSearched ? (
        <div className="initial-state">
          <header className="hero-header">
            <h1>Etymology DNA</h1>
            <p>Discover the linguistic ancestry of your sentences</p>
          </header>
          
          <div className="hero-search">
            <input
              type="text"
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              placeholder="Enter an English sentence to analyze its linguistic DNA..."
            />
            <button onClick={analyzeSentence} disabled={loading}>
              {loading ? 'Analyzing Linguistic DNA...' : 'Analyze Sentence'}
            </button>
          </div>
        </div>
      ) : (
        <div className="results-state">
          <header className="compact-header">
            <div className="header-content">
              <h2 className="logo">Etymology DNA</h2>
              <div className="compact-search">
                <input
                  type="text"
                  value={sentence}
                  onChange={(e) => setSentence(e.target.value)}
                  placeholder="Enter a sentence to analyze..."
                />
                <button onClick={analyzeSentence} disabled={loading}>
                  {loading ? 'Analyzing...' : 'Analyze'}
                </button>
              </div>
            </div>
          </header>

          <main className="results-content">
            {etymologyData.length > 0 && (
              <>
                {renderSentenceWithColors()}
                {renderDNAReport()}
              </>
            )}
          </main>
        </div>
      )}

      {hoveredWord && (
        <div className="tooltip">
          <h4>"{hoveredWord.word}"</h4>
          <p><strong>Origin:</strong> {hoveredWord.origin}</p>
          <p><strong>Etymology:</strong> {hoveredWord.details}</p>
          <p><strong>Confidence:</strong> {(hoveredWord.confidence * 100).toFixed(0)}%</p>
        </div>
      )}
    </div>
  );
}

export default App;