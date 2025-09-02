import React, { useEffect, useRef } from 'react';
import { LeafSystem } from './LeafSystem';
import './OrganicBackground.css';

interface OrganicBackgroundProps {
  glassmorphism?: boolean;
}

export const OrganicBackground: React.FC<OrganicBackgroundProps> = ({ glassmorphism = false }) => {
  const leafSystemRef = useRef<LeafSystem | null>(null);

  useEffect(() => {
    // Initialize leaf system
    leafSystemRef.current = new LeafSystem();
    
    // Handle window resize
    const handleResize = () => {
      // Logic for repositioning settled leaves if needed
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup on unmount
    return () => {
      if (leafSystemRef.current) {
        leafSystemRef.current.cleanup();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle pause/resume based on glassmorphism prop
  useEffect(() => {
    if (leafSystemRef.current) {
      if (glassmorphism) {
        leafSystemRef.current.pause();
      } else {
        leafSystemRef.current.resume();
      }
    }
  }, [glassmorphism]);

  return (
    <div className={`organic-background ${glassmorphism ? 'results-mode' : ''}`}>
      <div className="tree-branch branch-1"></div>
      <div className="tree-branch branch-2"></div>
      <div className="tree-branch branch-3"></div>
    </div>
  );
};