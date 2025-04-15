import React, { useState } from 'react';

const TestSelection: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  const handleTestSelection = (test: string) => {
    setSelectedTest(test);
  };

  return (
    <section id="test-selection" className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Select a Personality Test</h2>
      
      {!selectedTest ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 test-card transition-transform duration-200 ease-in-out transform hover:translate-y-1" onClick={() => handleTestSelection('OCEAN')}>
            <div className="content">
              <h3 className="text-xl font-bold mb-4">OCEAN Personality Test</h3>
              <p className="text-gray-600 mb-4">Assess your personality based on the Big Five traits: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism.</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 test-card transition-transform duration-200 ease-in-out transform hover:translate-y-1" onClick={() => handleTestSelection('MBTI')}>
            <div className="content">
              <h3 className="text-xl font-bold mb-4">Myers-Briggs Type Indicator (MBTI)</h3>
              <p className="text-gray-600 mb-4">Discover your personality type based on preferences in four dimensions: Extraversion-Introversion, Sensing-Intuition, Thinking-Feeling, and Judging-Perceiving.</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 test-card transition-transform duration-200 ease-in-out transform hover:translate-y-1" onClick={() => handleTestSelection('DISC')}>
            <div className="content">
              <h3 className="text-xl font-bold mb-4">DISC Assessment</h3>
              <p className="text-gray-600 mb-4">Understand your behavior and communication style based on four primary traits: Dominance, Influence, Steadiness, and Conscientiousness.</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 test-card transition-transform duration-200 ease-in-out transform hover:translate-y-1" onClick={() => handleTestSelection('Enneagram')}>
            <div className="content">
              <h3 className="text-xl font-bold mb-4">Enneagram</h3>
              <p className="text-gray-600 mb-4">Identify your personality type among nine distinct types, each with its own set of core beliefs, motivations, and fears.</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 test-card transition-transform duration-200 ease-in-out transform hover:translate-y-1" onClick={() => handleTestSelection('Hogan')}>
            <div className="content">
              <h3 className="text-xl font-bold mb-4">Hogan Personality Inventory (HPI)</h3>
              <p className="text-gray-600 mb-4">Predict job performance and assess workplace behavior based on seven primary scales: Adjustment, Ambition, Sociability, Interpersonal Sensitivity, Prudence, Inquisitive, and Learning Approach.</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 test-card transition-transform duration-200 ease-in-out transform hover:translate-y-1" onClick={() => handleTestSelection('16PF')}>
            <div className="content">
              <h3 className="text-xl font-bold mb-4">16PF Questionnaire</h3>
              <p className="text-gray-600 mb-4">Measure 16 primary personality factors to gain insights into your behavior, preferences, and potential.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold mb-4">You selected: {selectedTest}</h3>
          <p className="text-gray-600 mb-4">Here is a quick discussion on the {selectedTest} test type.</p>
          <p className="text-gray-600 mb-4">[Provide a detailed discussion on the selected test type]</p>
          <button
            onClick={() => setSelectedTest(null)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      )}
    </section>
  );
};

export default TestSelection;
