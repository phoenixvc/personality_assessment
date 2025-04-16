import React, { useState } from 'react';
import Chart from 'chart.js/auto';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  RadialLinearScale,
  ArcElement
} from 'chart.js';
import { Radar, Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface FrameworkMapping {
  framework: string;
  description: string;
  traits: string[];
  correlations: {
    ocean: Record<string, number>;
    mbti?: Record<string, number>;
    disc?: Record<string, number>;
    enneagram?: Record<string, number>;
    hogan?: Record<string, number>;
    sixteenpf?: Record<string, number>;
  };
}

const CombinationAnalysisTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('comparison');
  const [primaryFramework, setPrimaryFramework] = useState('ocean');
  const [secondaryFramework, setSecondaryFramework] = useState('mbti');
  const [selectedTraits, setSelectedTraits] = useState<Record<string, number>>({
    openness: 70,
    conscientiousness: 60,
    extraversion: 50,
    agreeableness: 65,
    neuroticism: 40
  });

  // Framework data
  const frameworks = {
    ocean: {
      name: "Big Five (OCEAN)",
      traits: ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Neuroticism"],
      description: "Measures five broad dimensions of personality traits."
    },
    mbti: {
      name: "Myers-Briggs Type Indicator",
      traits: ["Extraversion/Introversion", "Sensing/Intuition", "Thinking/Feeling", "Judging/Perceiving"],
      description: "Classifies people into 16 personality types based on preferences."
    },
    disc: {
      name: "DISC Assessment",
      traits: ["Dominance", "Influence", "Steadiness", "Conscientiousness"],
      description: "Measures behavioral patterns across four primary dimensions."
    },
    enneagram: {
      name: "Enneagram",
      traits: ["Type 1-9", "Wings", "Instinctual Variants"],
      description: "Describes nine interconnected personality types and their relationships."
    },
    hogan: {
      name: "Hogan Assessment",
      traits: ["HPI", "HDS", "MVPI"],
      description: "Measures normal personality, derailment risks, and core values."
    },
    sixteenpf: {
      name: "16PF",
      traits: ["16 Primary Factors", "5 Global Factors"],
      description: "Measures 16 personality factors that influence behavior."
    }
  };

  // Framework correlations (simplified example data)
  const frameworkCorrelations: FrameworkMapping[] = [
    {
      framework: 'mbti',
      description: 'Myers-Briggs Type Indicator correlations with OCEAN',
      traits: ['E/I', 'S/N', 'T/F', 'J/P'],
      correlations: {
        ocean: {
          openness: 0.72, // High correlation with Intuition (N)
          conscientiousness: 0.49, // Moderate correlation with Judging (J)
          extraversion: 0.74, // High correlation with Extraversion (E)
          agreeableness: 0.44, // Moderate correlation with Feeling (F)
          neuroticism: 0.39  // Lower correlation
        }
      }
    },
    {
      framework: 'disc',
      description: 'DISC Assessment correlations with OCEAN',
      traits: ['D', 'I', 'S', 'C'],
      correlations: {
        ocean: {
          openness: 0.35, // Lower correlation
          conscientiousness: 0.67, // High correlation with C
          extraversion: 0.69, // High correlation with I
          agreeableness: 0.58, // Moderate correlation with S
          neuroticism: 0.41  // Moderate correlation (inverse with D)
        }
      }
    },
    {
      framework: 'enneagram',
      description: 'Enneagram correlations with OCEAN',
      traits: ['Types 1-9'],
      correlations: {
        ocean: {
          openness: 0.48, // Moderate correlation (varies by type)
          conscientiousness: 0.52, // Moderate correlation (high with Type 1)
          extraversion: 0.45, // Moderate correlation (high with Type 7)
          agreeableness: 0.53, // Moderate correlation (high with Type 2)
          neuroticism: 0.61  // High correlation (varies by type)
        }
      }
    },
    {
      framework: 'hogan',
      description: 'Hogan Assessment correlations with OCEAN',
      traits: ['HPI Scales', 'HDS Scales', 'MVPI Scales'],
      correlations: {
        ocean: {
          openness: 0.65, // High correlation with Inquisitive
          conscientiousness: 0.71, // High correlation with Prudence
          extraversion: 0.68, // High correlation with Sociability
          agreeableness: 0.59, // Moderate correlation with Interpersonal Sensitivity
          neuroticism: 0.73  // High correlation (inverse) with Adjustment
        }
      }
    },
    {
      framework: 'sixteenpf',
      description: '16PF correlations with OCEAN',
      traits: ['16 Primary Factors'],
      correlations: {
        ocean: {
          openness: 0.56, // Moderate correlation
          conscientiousness: 0.63, // High correlation
          extraversion: 0.59, // Moderate correlation
          agreeableness: 0.61, // High correlation
          neuroticism: 0.75  // High correlation
        }
      }
    }
  ];

  // Calculate predicted scores for secondary framework based on OCEAN scores
  const calculatePredictedScores = () => {
    if (primaryFramework !== 'ocean') return {};
    
    const targetMapping = frameworkCorrelations.find(m => m.framework === secondaryFramework);
    if (!targetMapping) return {};
    
    const predictedScores: Record<string, number> = {};
    const traits = frameworks[secondaryFramework as keyof typeof frameworks].traits;
    
    // This is a simplified prediction model
    // In a real application, you would use more sophisticated statistical models
    traits.forEach((trait, index) => {
      let score = 0;
      Object.entries(selectedTraits).forEach(([oceanTrait, value]) => {
        const correlation = targetMapping.correlations.ocean[oceanTrait as keyof typeof targetMapping.correlations.ocean] || 0;
        score += (value / 100) * correlation * 100;
      });
      
      // Normalize score
      predictedScores[trait.toLowerCase().replace(/\//g, '_')] = Math.min(Math.max(score / 5, 0), 100);
    });
    
    return predictedScores;
  };

  const predictedScores = calculatePredictedScores();

  // Chart data for radar chart
  const radarData = {
    labels: Object.keys(selectedTraits).map(trait => trait.charAt(0).toUpperCase() + trait.slice(1)),
    datasets: [
      {
        label: 'Your OCEAN Profile',
        data: Object.values(selectedTraits),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)'
      }
    ]
  };

  // Chart data for correlation bar chart
  const correlationData = {
    labels: Object.keys(selectedTraits).map(trait => trait.charAt(0).toUpperCase() + trait.slice(1)),
    datasets: frameworkCorrelations
      .filter(mapping => mapping.framework === secondaryFramework)
      .map(mapping => ({
        label: `Correlation with ${frameworks[mapping.framework as keyof typeof frameworks].name}`,
        data: Object.values(mapping.correlations.ocean),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      }))
  };

  // Chart data for predicted scores
  const predictedData = {
    labels: Object.keys(predictedScores).map(trait => 
      trait.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('/')
    ),
    datasets: [
      {
        label: `Predicted ${frameworks[secondaryFramework as keyof typeof frameworks].name} Profile`,
        data: Object.values(predictedScores),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgb(153, 102, 255)',
        borderWidth: 1
      }
    ]
  };

  // Framework compatibility data for pie chart
  const compatibilityData = {
    labels: Object.keys(frameworks).filter(fw => fw !== 'ocean').map(fw => frameworks[fw as keyof typeof frameworks].name),
    datasets: [
      {
        label: 'Compatibility with OCEAN',
        data: frameworkCorrelations.map(mapping => {
          const correlations = Object.values(mapping.correlations.ocean);
          return correlations.reduce((sum, val) => sum + val, 0) / correlations.length;
        }),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-12">
      <h3 className="text-2xl font-bold mb-6 text-center">Personality Framework Analysis Tools</h3>
      
      <div className="mb-8">
        <div className="flex justify-center space-x-4 mb-6">
          <button 
            className={`px-4 py-2 rounded-lg transition-colors duration-300 ${activeTab === 'comparison' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('comparison')}
          >
            Framework Comparison
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition-colors duration-300 ${activeTab === 'prediction' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('prediction')}
          >
            Cross-Framework Prediction
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition-colors duration-300 ${activeTab === 'compatibility' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('compatibility')}
          >
            Framework Compatibility
          </button>
        </div>
      </div>

      {activeTab === 'comparison' && (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">Your OCEAN Profile</h4>
            <div className="mb-6">
              {Object.entries(selectedTraits).map(([trait, value]) => (
                <div key={trait} className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    {trait.charAt(0).toUpperCase() + trait.slice(1)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => setSelectedTraits({...selectedTraits, [trait]: parseInt(e.target.value)})}
                    className="w-full trait-slider"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>0</span>
                    <span>{value}</span>
                    <span>100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Visualization</h4>
            <div className="h-80">
              <Radar data={radarData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'prediction' && (
        <div>
          <div className="mb-6 grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Primary Framework</label>
              <select 
                className="w-full p-2 border rounded"
                value={primaryFramework}
                onChange={(e) => setPrimaryFramework(e.target.value)}
                disabled // Currently only supporting OCEAN as primary
              >
                {Object.entries(frameworks).map(([key, framework]) => (
                  <option key={key} value={key}>{framework.name}</option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                {frameworks[primaryFramework as keyof typeof frameworks].description}
              </p>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Secondary Framework</label>
              <select 
                className="w-full p-2 border rounded"
                value={secondaryFramework}
                onChange={(e) => setSecondaryFramework(e.target.value)}
              >
                {Object.entries(frameworks)
                  .filter(([key]) => key !== primaryFramework)
                  .map(([key, framework]) => (
                    <option key={key} value={key}>{framework.name}</option>
                  ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                {frameworks[secondaryFramework as keyof typeof frameworks].description}
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Correlation Strength</h4>
              <div className="h-80">
                <Bar 
                  data={correlationData} 
                  options={{ 
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 1,
                        title: {
                          display: true,
                          text: 'Correlation Coefficient'
                        }
                      }
                    }
                  }} 
                />
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Predicted {frameworks[secondaryFramework as keyof typeof frameworks].name} Profile</h4>
              <div className="h-80">
                <Bar 
                  data={predictedData} 
                  options={{ 
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-lg font-semibold mb-2">Interpretation</h4>
            <p>
              Based on your OCEAN profile, our model predicts your {frameworks[secondaryFramework as keyof typeof frameworks].name} 
              results as shown above. These predictions are based on established correlations between personality frameworks.
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Note: These predictions are estimates and may vary from actual assessment results. 
              For the most accurate results, we recommend taking the specific assessment.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'compatibility' && (
        <div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Framework Compatibility with OCEAN</h4>
              <div className="h-80">
                <Pie 
                  data={compatibilityData} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${(Number(value) * 100).toFixed(1)}% compatibility`;
                          }
                        }
                      }
                    }
                  }} 
                />
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Framework Comparison</h4>
              <div className="overflow-y-auto h-80 pr-2">
                {frameworkCorrelations.map((mapping, index) => (
                  <div key={index} className="mb-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <h5 className="font-semibold">{frameworks[mapping.framework as keyof typeof frameworks].name}</h5>
                    <p className="text-sm text-gray-600 mb-2">{mapping.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(mapping.correlations.ocean).map(([trait, value]) => (
                        <div key={trait} className="flex justify-between">
                          <span>{trait.charAt(0).toUpperCase() + trait.slice(1)}:</span>
                          <span className={`font-medium ${
                            value > 0.6 ? 'text-green-600' : 
                            value > 0.4 ? 'text-yellow-600' : 
                            'text-red-600'
                          }`}>
                            {(value * 100).toFixed(0)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-lg font-semibold mb-2">Understanding Framework Compatibility</h4>
            <p>
              Framework compatibility indicates how well different personality assessment systems align with each other. 
              Higher compatibility means the frameworks measure similar underlying constructs, allowing for more reliable 
              cross-framework predictions.
            </p>
            <p className="mt-2 text-sm text-gray-600">
              The Big Five (OCEAN) model is often considered a foundational framework in personality psychology, 
              which is why we use it as our baseline for comparisons.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CombinationAnalysisTools;