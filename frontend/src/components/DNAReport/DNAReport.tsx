import React from 'react';
import { OriginPercentage } from '../../types';
import './DNAReport.css';

interface DNAReportProps {
  percentages: OriginPercentage[];
}

export const DNAReport: React.FC<DNAReportProps> = ({ percentages }) => {
  return (
    <div className="dna-report">
      <div className="report-content">
        <div className="ancestry-bars">
          <div className="chromosome-visualization">
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