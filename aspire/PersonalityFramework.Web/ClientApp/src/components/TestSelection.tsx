import { motion } from 'framer-motion';
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/TestSelection.module.css';

interface AssessmentType {
  id: string;
  title: string;
  description: string;
  icon: string;
  timeEstimate: string;
  questionCount: number;
  color: string;
}

const TestSelection: React.FC = () => {
  const assessmentTypes: AssessmentType[] = [
    {
      id: 'big5',
      title: 'Big Five Personality',
      description: 'Measures the five major dimensions of personality: openness, conscientiousness, extraversion, agreeableness, and neuroticism.',
      icon: '🌟',
      timeEstimate: '10-15 min',
      questionCount: 50,
      color: '#4F46E5'
    },
    {
      id: 'myers-briggs',
      title: 'Myers-Briggs Type Indicator',
      description: 'Identifies your psychological preferences in how you perceive the world and make decisions.',
      icon: '🧠',
      timeEstimate: '15-20 min',
      questionCount: 60,
      color: '#10B981'
    },
    {
      id: 'disc',
      title: 'DISC Assessment',
      description: 'Measures dominance, influence, steadiness, and conscientiousness personality traits.',
      icon: '📊',
      timeEstimate: '8-10 min',
      questionCount: 28,
      color: '#F59E0B'
    },
    {
      id: 'enneagram',
      title: 'Enneagram',
      description: 'Identifies your core personality type from nine interconnected personality types.',
      icon: '⭐',
      timeEstimate: '12-15 min',
      questionCount: 45,
      color: '#8B5CF6'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      y: -10,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: {
        type: 'spring',
        stiffness: 300
      }
    }
  };

  return (
    <section className={styles.testSelectionSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Choose Your Assessment</h2>
          <p className={styles.sectionDescription}>
            Discover different aspects of your personality with our scientifically validated assessments
          </p>
        </div>

        <motion.div 
          className={styles.assessmentGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {assessmentTypes.map((assessment) => (
            <motion.div
              key={assessment.id}
              className={styles.assessmentCard}
              variants={cardVariants}
              whileHover="hover"
              style={{ 
                borderTopColor: assessment.color,
                borderTopWidth: '4px',
                borderTopStyle: 'solid'
              }}
            >
              <div className={styles.cardIcon} style={{ backgroundColor: `${assessment.color}20` }}>
                <span role="img" aria-label={assessment.title}>{assessment.icon}</span>
              </div>
              <h3 className={styles.cardTitle}>{assessment.title}</h3>
              <p className={styles.cardDescription}>{assessment.description}</p>
              
              <div className={styles.cardMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>⏱️</span>
                  <span className={styles.metaText}>{assessment.timeEstimate}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>❓</span>
                  <span className={styles.metaText}>{assessment.questionCount} questions</span>
                </div>
              </div>
              
              <Link to={`/assessments/${assessment.id}`} className={styles.cardButton}>
                Start Assessment
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestSelection;