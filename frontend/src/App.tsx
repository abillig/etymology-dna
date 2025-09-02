import React, { useState } from 'react';
import { WordOrigin, EtymologyResponse, OriginPercentage } from './types';
import { OrganicBackground } from './components/OrganicBackground/OrganicBackground';
import { SearchInput } from './components/SearchInput/SearchInput';
import { SentenceDisplay } from './components/SentenceDisplay/SentenceDisplay';
import { DNAReport } from './components/DNAReport/DNAReport';
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

  return (
    <div className={`app ${hasSearched ? 'searched' : 'initial'}`}>
      <OrganicBackground glassmorphism={hasSearched} />
      
      {!hasSearched ? (
        <div className="initial-state">
          <header className="hero-header">
            <h1>Etymology DNA</h1>
            <p>Discover the linguistic ancestry of your sentences</p>
          </header>
          
          <SearchInput
            value={sentence}
            onChange={setSentence}
            onSubmit={analyzeSentence}
            loading={loading}
            isCompact={false}
          />
        </div>
      ) : (
        <div className="results-state">
          <div className="back-to-search">
            <button 
              onClick={() => setHasSearched(false)}
              className="back-button"
            >
              ← New Analysis
            </button>
          </div>

          <main className="results-content">
            {etymologyData.length > 0 && (
              <>
                <SentenceDisplay
                  words={etymologyData}
                  onWordHover={setHoveredWord}
                />
                <DNAReport percentages={percentages} />
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