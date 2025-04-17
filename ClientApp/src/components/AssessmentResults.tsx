import React from 'react';

interface AssessmentResult {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

interface AssessmentResultsProps {
  results: AssessmentResult[];
}

const AssessmentResults: React.FC<AssessmentResultsProps> = ({ results }) => {
  return (
    <section id="assessment-results" className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Saved Assessment Results</h2>
      {results.length === 0 ? (
        <p>No saved results yet.</p>
      ) : (
        <ul className="list-disc pl-5">
          {results.map((result, index) => (
            <li key={index}>
              Openness: {result.openness}, Conscientiousness: {result.conscientiousness}, Extraversion: {result.extraversion}, Agreeableness: {result.agreeableness}, Neuroticism: {result.neuroticism}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default AssessmentResults;
