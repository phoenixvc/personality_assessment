import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import styles from '../styles/Assessment.module.css';

interface Question {
  id: number;
  text: string;
  options: {
    id: number;
    text: string;
    value: number;
  }[];
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  questions: Question[];
  estimatedTime: string;
  bannerImage: string;
}

const AssessmentPage: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // const response = await fetch(`/api/assessments/${assessmentId}`);
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockAssessment: Assessment = {
          id: assessmentId || 'personality',
          title: 'Personality Assessment',
          description: 'Discover your unique personality traits and tendencies.',
          instructions: 'Read each statement carefully and select the option that best describes you. There are no right or wrong answers, so choose the response that most accurately reflects your natural tendencies.',
          estimatedTime: '10-15 minutes',
          bannerImage: '/images/banners/personality-assessment.jpg',
          questions: [
            {
              id: 1,
              text: 'I enjoy being the center of attention at social gatherings.',
              options: [
                { id: 1, text: 'Strongly Disagree', value: 1 },
                { id: 2, text: 'Disagree', value: 2 },
                { id: 3, text: 'Neutral', value: 3 },
                { id: 4, text: 'Agree', value: 4 },
                { id: 5, text: 'Strongly Agree', value: 5 }
              ]
            },
            {
              id: 2,
              text: 'I prefer to plan my activities carefully rather than act spontaneously.',
              options: [
                { id: 1, text: 'Strongly Disagree', value: 1 },
                { id: 2, text: 'Disagree', value: 2 },
                { id: 3, text: 'Neutral', value: 3 },
                { id: 4, text: 'Agree', value: 4 },
                { id: 5, text: 'Strongly Agree', value: 5 }
              ]
            },
            {
              id: 3,
              text: 'I often think about abstract concepts and theories.',
              options: [
                { id: 1, text: 'Strongly Disagree', value: 1 },
                { id: 2, text: 'Disagree', value: 2 },
                { id: 3, text: 'Neutral', value: 3 },
                { id: 4, text: 'Agree', value: 4 },
                { id: 5, text: 'Strongly Agree', value: 5 }
              ]
            },
            {
              id: 4,
              text: 'I make decisions based more on logic than on emotions.',
              options: [
                { id: 1, text: 'Strongly Disagree', value: 1 },
                { id: 2, text: 'Disagree', value: 2 },
                { id: 3, text: 'Neutral', value: 3 },
                { id: 4, text: 'Agree', value: 4 },
                { id: 5, text: 'Strongly Agree', value: 5 }
              ]
            },
            {
              id: 5,
              text: 'I prefer working in a structured environment with clear expectations.',
              options: [
                { id: 1, text: 'Strongly Disagree', value: 1 },
                { id: 2, text: 'Disagree', value: 2 },
                { id: 3, text: 'Neutral', value: 3 },
                { id: 4, text: 'Agree', value: 4 },
                { id: 5, text: 'Strongly Agree', value: 5 }
              ]
            },
            // Add more questions as needed
          ]
        };
        
        setAssessment(mockAssessment);
        setError(null);
      } catch (err) {
        console.error('Error fetching assessment:', err);
        setError('Failed to load assessment. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [assessmentId]);

  const handleStartAssessment = () => {
    setIsStarted(true);
  };

  const handleSelectAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (assessment && currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmitAssessment = async () => {
    if (!assessment) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call to submit answers
      // await fetch('/api/assessments/submit', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ assessmentId, answers })
      // });
      
      // Mock submission - wait 1 second to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to results page
      navigate(`/assessments/${assessmentId}/results`);
    } catch (err) {
      console.error('Error submitting assessment:', err);
      setError('Failed to submit assessment. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Loading Assessment">
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading assessment...</p>
        </div>
      </Layout>
    );
  }

  if (error || !assessment) {
    return (
      <Layout title="Error">
        <div className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>Something went wrong</h2>
          <p className={styles.errorMessage}>{error}</p>
          <button 
            className={styles.primaryButton}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / assessment.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === assessment.questions.length - 1;
  const isCurrentQuestionAnswered = answers[currentQuestion.id] !== undefined;

  return (
    <Layout 
      title={assessment.title} 
      subtitle={assessment.description}
      bannerImage={assessment.bannerImage}
    >
      {!isStarted ? (
        <div className={styles.introContainer}>
          <div className={styles.introCard}>
            <h2 className={styles.introTitle}>About This Assessment</h2>
            <p className={styles.introDescription}>{assessment.description}</p>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Estimated Time:</span>
              <span className={styles.infoValue}>{assessment.estimatedTime}</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Number of Questions:</span>
              <span className={styles.infoValue}>{assessment.questions.length}</span>
            </div>
            
            <h3 className={styles.instructionsTitle}>Instructions</h3>
            <p className={styles.instructions}>{assessment.instructions}</p>
            
            <button 
              className={styles.primaryButton}
              onClick={handleStartAssessment}
            >
              Start Assessment
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.assessmentContainer}>
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className={styles.progressText}>
              Question {currentQuestionIndex + 1} of {assessment.questions.length}
            </div>
          </div>
          
          <div className={styles.questionCard}>
            <h2 className={styles.questionText}>{currentQuestion.text}</h2>
            
            <div className={styles.optionsContainer}>
              {currentQuestion.options.map(option => (
                <button
                  key={option.id}
                  className={`${styles.optionButton} ${
                    answers[currentQuestion.id] === option.value ? styles.optionSelected : ''
                  }`}
                  onClick={() => handleSelectAnswer(currentQuestion.id, option.value)}
                >
                  {option.text}
                </button>
              ))}
            </div>
            
            <div className={styles.navigationButtons}>
              <button
                className={`${styles.navButton} ${currentQuestionIndex === 0 ? styles.navButtonDisabled : ''}`}
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              
              {isLastQuestion ? (
                <button
                  className={`${styles.primaryButton} ${!isCurrentQuestionAnswered || isSubmitting ? styles.buttonDisabled : ''}`}
                  onClick={handleSubmitAssessment}
                  disabled={!isCurrentQuestionAnswered || isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                </button>
              ) : (
                <button
                  className={`${styles.navButton} ${!isCurrentQuestionAnswered ? styles.navButtonDisabled : ''}`}
                  onClick={handleNextQuestion}
                  disabled={!isCurrentQuestionAnswered}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AssessmentPage;