import React, { useEffect, useRef } from 'react';
import { LeafSystem } from './LeafSystem';
import './OrganicBackground.css';

export const OrganicBackground: React.FC = () => {
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

  return (
    <div className="organic-background">
      <div className="tree-branch branch-1"></div>
      <div className="tree-branch branch-2"></div>
      <div className="tree-branch branch-3"></div>
    </div>
  );
};