import React from 'react';

interface MethodDescriptionCardProps {
  title: string;
  description: string;
}

const MethodDescriptionCard: React.FC<MethodDescriptionCardProps> = ({ title, description }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 method-card transition-transform duration-200 ease-in-out transform hover:translate-y-1">
      <div className="content">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
      </div>
    </div>
  );
};

export default MethodDescriptionCard;
