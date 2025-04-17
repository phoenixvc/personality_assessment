import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { animateRadarChart } from '../utils/animationUtils';
import Combinations from './Combinations';

const Assessment: React.FC = () => {
  const [openness, setOpenness] = useState(50);
  const [conscientiousness, setConscientiousness] = useState(50);
  const [extraversion, setExtraversion] = useState(50);
  const [agreeableness, setAgreeableness] = useState(50);
  const [neuroticism, setNeuroticism] = useState(50);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [savedResults, setSavedResults] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const chartRef = useRef<Chart | null>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (chartCanvasRef.current) {
      // Create radar chart
      const ctx = chartCanvasRef.current.getContext('2d');
      if (ctx) {
        chartRef.current = new Chart(ctx, {
          type: 'radar',
          data: {
            labels: ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'],
            datasets: [{
              label: 'Your Personality Profile',
              data: [openness, conscientiousness, extraversion, agreeableness, neuroticism],
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 2,
              pointBackgroundColor: 'rgba(59, 130, 246, 1)',
              pointRadius: 4
            }]
          },
          options: {
            scales: {
              r: {
                min: 0,
                max: 100,
                ticks: {
                  stepSize: 20
                }
              }
            },
            animation: {
              duration: 1500,
              easing: 'easeOutQuart'
            }
          }
        });
      }
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      // Update chart data when sliders change
      animateRadarChart(chartRef, [openness, conscientiousness, extraversion, agreeableness, neuroticism]);
    }
  }, [openness, conscientiousness, extraversion, agreeableness, neuroticism]);

  const validateSliders = () => {
    const errors: string[] = [];
    if (openness < 0 || openness > 100) errors.push('Openness must be between 0 and 100.');
    if (conscientiousness < 0 || conscientiousness > 100) errors.push('Conscientiousness must be between 0 and 100.');
    if (extraversion < 0 || extraversion > 100) errors.push('Extraversion must be between 0 and 100.');
    if (agreeableness < 0 || agreeableness > 100) errors.push('Agreeableness must be between 0 and 100.');
    if (neuroticism < 0 || neuroticism > 100) errors.push('Neuroticism must be between 0 and 100.');
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSliders()) return;
    // Handle form submission with animation
    const button = e.currentTarget.querySelector('button');
    if (button) {
      button.classList.add('animate-submit');
      setTimeout(() => {
        button.classList.remove('animate-submit');
        setIsSubmitted(true);
        // Save results
        const newResult = { openness, conscientiousness, extraversion, agreeableness, neuroticism };
        setSavedResults([...savedResults, newResult]);
      }, 1000);
    }
  };

  return (
    <section id="assessment" className="container mx-auto px-4 py-12 slide-in-bottom">
      <h2 className="text-3xl font-bold mb-8 text-center fade-in">Personality Assessment</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 slide-in-left">
          <div className="mb-6">
            <label htmlFor="openness" className="block text-gray-700 font-bold mb-2">
              Openness
              <span className="ml-2 text-gray-500 cursor-pointer" title="Openness to experience describes a person's level of creativity, curiosity, and willingness to try new things.">
                <i className="fas fa-info-circle"></i>
              </span>
            </label>
            <input
              type="range"
              id="openness"
              name="openness"
              min="0"
              max="100"
              value={openness}
              onChange={(e) => setOpenness(Number(e.target.value))}
              className="w-full trait-slider transition-transform duration-200 ease-in-out transform hover:scale-105"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>0</span>
              <span>{openness}</span>
              <span>100</span>
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="conscientiousness" className="block text-gray-700 font-bold mb-2">
              Conscientiousness
              <span className="ml-2 text-gray-500 cursor-pointer" title="Conscientiousness reflects a person's level of organization, dependability, and work ethic.">
                <i className="fas fa-info-circle"></i>
              </span>
            </label>
            <input
              type="range"
              id="conscientiousness"
              name="conscientiousness"
              min="0"
              max="100"
              value={conscientiousness}
              onChange={(e) => setConscientiousness(Number(e.target.value))}
              className="w-full trait-slider transition-transform duration-200 ease-in-out transform hover:scale-105"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>0</span>
              <span>{conscientiousness}</span>
              <span>100</span>
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="extraversion" className="block text-gray-700 font-bold mb-2">
              Extraversion
              <span className="ml-2 text-gray-500 cursor-pointer" title="Extraversion indicates how outgoing, energetic, and sociable a person is.">
                <i className="fas fa-info-circle"></i>
              </span>
            </label>
            <input
              type="range"
              id="extraversion"
              name="extraversion"
              min="0"
              max="100"
              value={extraversion}
              onChange={(e) => setExtraversion(Number(e.target.value))}
              className="w-full trait-slider transition-transform duration-200 ease-in-out transform hover:scale-105"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>0</span>
              <span>{extraversion}</span>
              <span>100</span>
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="agreeableness" className="block text-gray-700 font-bold mb-2">
              Agreeableness
              <span className="ml-2 text-gray-500 cursor-pointer" title="Agreeableness measures a person's level of compassion, cooperativeness, and friendliness.">
                <i className="fas fa-info-circle"></i>
              </span>
            </label>
            <input
              type="range"
              id="agreeableness"
              name="agreeableness"
              min="0"
              max="100"
              value={agreeableness}
              onChange={(e) => setAgreeableness(Number(e.target.value))}
              className="w-full trait-slider transition-transform duration-200 ease-in-out transform hover:scale-105"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>0</span>
              <span>{agreeableness}</span>
              <span>100</span>
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="neuroticism" className="block text-gray-700 font-bold mb-2">
              Neuroticism
              <span className="ml-2 text-gray-500 cursor-pointer" title="Neuroticism represents a person's tendency to experience negative emotions, such as anxiety, anger, or depression.">
                <i className="fas fa-info-circle"></i>
              </span>
            </label>
            <input
              type="range"
              id="neuroticism"
              name="neuroticism"
              min="0"
              max="100"
              value={neuroticism}
              onChange={(e) => setNeuroticism(Number(e.target.value))}
              className="w-full trait-slider transition-transform duration-200 ease-in-out transform hover:scale-105"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>0</span>
              <span>{neuroticism}</span>
              <span>100</span>
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out hover:bg-blue-700 pulse"
          >
            Submit
          </button>
          {isSubmitted && (
            <div className="mt-4 text-green-600">
              Your assessment has been successfully submitted!
            </div>
          )}
          {validationErrors.length > 0 && (
            <div className="mt-4 text-red-600">
              {validationErrors.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
        </form>
        
        <div className="bg-white rounded-xl shadow-lg p-8 slide-in-right">
          <h3 className="text-xl font-bold mb-6 text-center">Your Personality Profile</h3>
          <div className="radar-chart-container">
            <canvas ref={chartCanvasRef} className="radar-chart"></canvas>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Saved Results</h3>
        {savedResults.length === 0 ? (
          <p>No saved results yet.</p>
        ) : (
          <ul className="list-disc pl-5">
            {savedResults.map((result, index) => (
              <li key={index}>
                Openness: {result.openness}, Conscientiousness: {result.conscientiousness}, Extraversion: {result.extraversion}, Agreeableness: {result.agreeableness}, Neuroticism: {result.neuroticism}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Combinations />
    </section>
  );
};
export default Assessment;
