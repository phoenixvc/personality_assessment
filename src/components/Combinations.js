import React from 'react';
import CombinationCard from './CombinationCard';
import CombinationAnalysisTools from './CombinationAnalysisTools';

const Combinations = () => {
  return (
    <section id="combinations" className="mb-16">
      <h2 className="text-3xl font-bold mb-8 text-center">Comprehensive Trait Combinations</h2>
      
      <div className="mb-12">
        <div className="flex justify-center space-x-4 mb-8">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out">All Combinations</button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out">Common Types</button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out">Rare Combinations</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CombinationCard
          title="Structured Explorer"
          traits={[
            { label: 'Low Openness', type: 'low' },
            { label: 'High Conscientiousness', type: 'high' }
          ]}
          description="Methodical approach to new experiences while maintaining structure"
          points={[
            'Systematic travel planning',
            'Goal-oriented exploration',
            'Structured adventure seeking'
          ]}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          iconText="SE"
        />
        <CombinationCard
          title="Resilient Achiever"
          traits={[
            { label: 'High Conscientiousness', type: 'high' },
            { label: 'Low Neuroticism', type: 'low' }
          ]}
          description="Stable and goal-oriented with strong emotional control"
          points={[
            'Excellent stress management',
            'Consistent performance',
            'Long-term goal achievement'
          ]}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          iconText="RA"
        />
        <CombinationCard
          title="Social Architect"
          traits={[
            { label: 'High Extraversion', type: 'high' },
            { label: 'High Conscientiousness', type: 'high' }
          ]}
          description="Organized and outgoing with strong leadership potential"
          points={[
            'Structured networking',
            'Organized social events',
            'Systematic relationship building'
          ]}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          iconText="SA"
        />
        <CombinationCard
          title="Diplomatic Innovator"
          traits={[
            { label: 'High Openness', type: 'high' },
            { label: 'High Agreeableness', type: 'high' }
          ]}
          description="Creative problem-solver with strong interpersonal skills"
          points={[
            'Collaborative innovation',
            'Empathetic leadership',
            'Inclusive decision-making'
          ]}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
          iconText="DI"
        />
        <CombinationCard
          title="Steady Operator"
          traits={[
            { label: 'Low Openness', type: 'low' },
            { label: 'Low Neuroticism', type: 'low' }
          ]}
          description="Reliable and stable with preference for established methods"
          points={[
            'Consistent execution',
            'Reliable performance',
            'Stable work patterns'
          ]}
          iconBg="bg-red-100"
          iconColor="text-red-600"
          iconText="SO"
        />
        <CombinationCard
          title="Dynamic Connector"
          traits={[
            { label: 'High Extraversion', type: 'high' },
            { label: 'High Agreeableness', type: 'high' }
          ]}
          description="Socially adept with strong relationship-building skills"
          points={[
            'Natural networking',
            'Team building',
            'Social harmony'
          ]}
          iconBg="bg-indigo-100"
          iconColor="text-indigo-600"
          iconText="DC"
        />
        <CombinationCard
          title="Analytical Perfectionist"
          traits={[
            { label: 'High Conscientiousness', type: 'high' },
            { label: 'Moderate Neuroticism', type: 'moderate' }
          ]}
          description="Detail-oriented with high standards and some anxiety about performance"
          points={[
            'Meticulous planning',
            'Quality-focused',
            'Continuous improvement'
          ]}
          iconBg="bg-pink-100"
          iconColor="text-pink-600"
          iconText="AP"
        />
        <CombinationCard
          title="Quiet Innovator"
          traits={[
            { label: 'High Openness', type: 'high' },
            { label: 'Low Extraversion', type: 'low' }
          ]}
          description="Creative thinker who prefers solitary innovation"
          points={[
            'Independent creativity',
            'Deep analysis',
            'Thoughtful innovation'
          ]}
          iconBg="bg-teal-100"
          iconColor="text-teal-600"
          iconText="QI"
        />
        <CombinationCard
          title="Adaptable Leader"
          traits={[
            { label: 'High Openness', type: 'high' },
            { label: 'High Extraversion', type: 'high' },
            { label: 'High Conscientiousness', type: 'high' }
          ]}
          description="Flexible leader who balances innovation with execution"
          points={[
            'Strategic thinking',
            'Change management',
            'Team inspiration'
          ]}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
          iconText="AL"
        />
      </div>

      <CombinationAnalysisTools />
    </section>
  );
};

export default Combinations;
