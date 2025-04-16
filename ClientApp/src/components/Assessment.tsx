import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { animateRadarChart } from '../utils/animationUtils';

const Assessment: React.FC = () => {
  const [openness, setOpenness] = useState(50);
  const [conscientiousness, setConscientiousness] = useState(50);
  const [extraversion, setExtraversion] = useState(50);
  const [agreeableness, setAgreeableness] = useState(50);
  const [neuroticism, setNeuroticism] = useState(50);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission with animation
    const button = e.currentTarget.querySelector('button');
    if (button) {
      button.classList.add('animate-submit');
      setTimeout(() => {
        button.classList.remove('animate-submit');
        // Submit logic here
      }, 1000);
    }
  };

  return (
    <section id="assessment" className="container mx-auto px-4 py-12 slide-in-bottom">
      <h2 className="text-3xl font-bold mb-8 text-center fade-in">Personality Assessment</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 slide-in-left">
          <div className="mb-6">
            <label htmlFor="openness" className="block text-gray-700 font-bold mb-2">Openness</label>
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
            <label htmlFor="conscientiousness" className="block text-gray-700 font-bold mb-2">Conscientiousness</label>
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
            <label htmlFor="extraversion" className="block text-gray-700 font-bold mb-2">Extraversion</label>
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
            <label htmlFor="agreeableness" className="block text-gray-700 font-bold mb-2">Agreeableness</label>
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
            <label htmlFor="neuroticism" className="block text-gray-700 font-bold mb-2">Neuroticism</label>
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
        </form>
        
        <div className="bg-white rounded-xl shadow-lg p-8 slide-in-right">
          <h3 className="text-xl font-bold mb-6 text-center">Your Personality Profile</h3>
          <div className="radar-chart-container">
            <canvas ref={chartCanvasRef} className="radar-chart"></canvas>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Assessment;
