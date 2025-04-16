import React from 'react';
import EnneagramQuiz from './methods/othermethods/EnneagramQuiz';
import EnneagramResults from './methods/othermethods/EnneagramResults';
import HoganQuiz from './methods/othermethods/HoganQuiz';
import HoganResults from './methods/othermethods/HoganResults';
import SixteenPFQuiz from './methods/othermethods/SixteenPFQuiz';
import SixteenPFResults from './methods/othermethods/SixteenPFResults';

const OtherMethods: React.FC = () => {
  return (
    <section id="other-methods" className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Other Personality Assessment Methods</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 method-card transition-transform duration-200 ease-in-out transform hover:translate-y-1">
          <div className="content">
            <h3 className="text-xl font-bold mb-4">Myers-Briggs Type Indicator (MBTI)</h3>
            <p className="text-gray-600 mb-4">A widely used personality assessment tool that categorizes individuals into 16 distinct personality types based on their preferences in four dimensions: Extraversion-Introversion, Sensing-Intuition, Thinking-Feeling, and Judging-Perceiving.</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 method-card transition-transform duration-200 ease-in-out transform hover:translate-y-1">
          <div className="content">
            <h3 className="text-xl font-bold mb-4">DISC Assessment</h3>
            <p className="text-gray-600 mb-4">A behavior assessment tool that focuses on four primary personality traits: Dominance, Influence, Steadiness, and Conscientiousness. It helps individuals understand their behavior and communication styles.</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 method-card transition-transform duration-200 ease-in-out transform hover:translate-y-1">
          <div className="content">
            <h3 className="text-xl font-bold mb-4">Enneagram</h3>
            <p className="text-gray-600 mb-4">A personality typing system that identifies nine distinct personality types, each with its own set of core beliefs, motivations, and fears. It provides insights into personal growth and interpersonal relationships.</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 method-card transition-transform duration-200 ease-in-out transform hover:translate-y-1">
          <div className="content">
            <h3 className="text-xl font-bold mb-4">Big Five Personality Traits</h3>
            <p className="text-gray-600 mb-4">A widely accepted model that describes personality using five broad dimensions: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism. It is used in various psychological research and practical applications.</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 method-card transition-transform duration-200 ease-in-out transform hover:translate-y-1">
          <div className="content">
            <h3 className="text-xl font-bold mb-4">Hogan Personality Inventory (HPI)</h3>
            <p className="text-gray-600 mb-4">A personality assessment tool designed to predict job performance and assess workplace behavior. It measures seven primary scales: Adjustment, Ambition, Sociability, Interpersonal Sensitivity, Prudence, Inquisitive, and Learning Approach.</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 method-card transition-transform duration-200 ease-in-out transform hover:translate-y-1">
          <div className="content">
            <h3 className="text-xl font-bold mb-4">16PF Questionnaire</h3>
            <p className="text-gray-600 mb-4">A comprehensive personality assessment tool that measures 16 primary personality factors and provides insights into an individual's behavior, preferences, and potential. It is used in various settings, including clinical, educational, and organizational contexts.</p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <EnneagramQuiz />
        <EnneagramResults />
        <HoganQuiz />
        <HoganResults />
        <SixteenPFQuiz />
        <SixteenPFResults />
      </div>
    </section>
  );
};

export default OtherMethods;
