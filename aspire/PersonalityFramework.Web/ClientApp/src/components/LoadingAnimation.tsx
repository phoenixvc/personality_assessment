import { motion } from 'framer-motion';
import React from 'react';
import styles from '../styles/Loading.module.css';

interface LoadingAnimationProps {
  isLoading: boolean;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.loadingContainer}>
        <motion.div
          className={styles.loadingLogo}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 0, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" />
            <path d="M40 12C40 12 24 28 24 40C24 52 40 68 40 68" stroke="currentColor" strokeWidth="4" />
            <path d="M40 12C40 12 56 28 56 40C56 52 40 68 40 68" stroke="currentColor" strokeWidth="4" />
            <circle cx="40" cy="40" r="8" fill="currentColor" />
          </svg>
        </motion.div>
        
        <motion.h1 
          className={styles.loadingTitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Personality Framework
        </motion.h1>
        
        <motion.div 
          className={styles.loadingBar}
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        <motion.p
          className={styles.loadingText}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          Loading your experience...
        </motion.p>
      </div>
    </div>
  );
};

export default LoadingAnimation;