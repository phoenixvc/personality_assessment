import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TestSelection from './components/TestSelection';
import LoadingAnimation from './components/LoadingAnimation';
import { initScrollAnimations, initChartAnimations } from './utils/animationUtils';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Initialize animations after loading completes
      initScrollAnimations();
      initChartAnimations();
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Re-initialize animations on window resize
      const handleResize = () => {
        initScrollAnimations();
        initChartAnimations();
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isLoading]);
  return (
    <div className="App">
      <LoadingAnimation isLoading={isLoading} />
      
      {!isLoading && (
        <div className="page-content fade-in">
          <Header />
          <TestSelection />
          <Footer />
        </div>
      )}
    </div>
  );
}

export default App;