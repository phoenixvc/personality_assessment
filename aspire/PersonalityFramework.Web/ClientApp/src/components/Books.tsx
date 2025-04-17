import React from 'react';

interface BookRecommendation {
  title: string;
  author: string;
  description: string;
}

interface BooksProps {
  recommendations: BookRecommendation[];
}

const Books: React.FC<BooksProps> = ({ recommendations }) => {
  return (
    <section id="books" className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Book Recommendations</h2>
      {recommendations.length === 0 ? (
        <p>No book recommendations available.</p>
      ) : (
        <ul className="list-disc pl-5">
          {recommendations.map((recommendation, index) => (
            <li key={index}>
              <h3 className="text-xl font-semibold">{recommendation.title}</h3>
              <p className="text-gray-600">by {recommendation.author}</p>
              <p>{recommendation.description}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Books;
