import React from 'react';

interface CareerRecommendation {
  title: string;
  description: string;
}

interface CareersProps {
  recommendations: CareerRecommendation[];
}

const Careers: React.FC<CareersProps> = ({ recommendations }) => {
  return (
    <section id="careers" className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Career Recommendations</h2>
      {recommendations.length === 0 ? (
        <p>No career recommendations available.</p>
      ) : (
        <ul className="list-disc pl-5">
          {recommendations.map((recommendation, index) => (
            <li key={index}>
              <h3 className="text-xl font-semibold">{recommendation.title}</h3>
              <p>{recommendation.description}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Careers;
