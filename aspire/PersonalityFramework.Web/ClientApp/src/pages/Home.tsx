import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import styles from '../styles/Home.module.css';

const Home: React.FC = () => {
  return (
    <Layout
      title="Discover Your Personality"
      subtitle="Gain insights into your unique traits, strengths, and potential areas for growth"
      bannerImage="/images/banners/home-banner.jpg"
    >
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>Understand Yourself and Others Better</h2>
          <p className={styles.heroDescription}>
            Our scientifically validated personality assessments help you gain deeper insights into your
            natural tendencies, strengths, and potential areas for growth.
          </p>
          <div className={styles.heroCta}>
            <Link to="/assessments" className={styles.primaryButton}>
              Take an Assessment
            </Link>
            <Link to="/about" className={styles.secondaryButton}>
              Learn More
            </Link>
          </div>
        </div>
      </div>

      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Our Assessments</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <i className="fas fa-brain"></i>
            </div>
            <h3 className={styles.featureTitle}>Personality Profile</h3>
            <p className={styles.featureDescription}>
              Discover your unique personality traits and how they influence your behavior, relationships, and decisions.
            </p>
            <Link to="/assessments/personality" className={styles.featureLink}>
              Learn More →
            </Link>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <i className="fas fa-chart-line"></i>
            </div>
            <h3 className={styles.featureTitle}>Strengths Assessment</h3>
            <p className={styles.featureDescription}>
              Identify your natural strengths and learn how to leverage them for personal and professional growth.
            </p>
            <Link to="/assessments/strengths" className={styles.featureLink}>
              Learn More →
            </Link>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <i className="fas fa-users"></i>
            </div>
            <h3 className={styles.featureTitle}>Team Dynamics</h3>
            <p className={styles.featureDescription}>
              Understand how different personality types interact and create more effective team collaboration.
            </p>
            <Link to="/assessments/teams" className={styles.featureLink}>
              Learn More →
            </Link>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <i className="fas fa-lightbulb"></i>
            </div>
            <h3 className={styles.featureTitle}>Leadership Style</h3>
            <p className={styles.featureDescription}>
              Discover your natural leadership approach and how to adapt it to different situations and team members.
            </p>
            <Link to="/assessments/leadership" className={styles.featureLink}>
              Learn More →
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.howItWorksSection}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <div className={styles.stepsContainer}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Take the Assessment</h3>
            <p className={styles.stepDescription}>
              Complete our scientifically validated assessment in just 10-15 minutes.
            </p>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>Get Your Results</h3>
            <p className={styles.stepDescription}>
              Receive a detailed report of your personality profile and key insights.
            </p>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>Apply Your Insights</h3>
            <p className={styles.stepDescription}>
              Use your personalized recommendations to improve relationships, work, and personal growth.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.testimonialsSection}>
        <h2 className={styles.sectionTitle}>What People Say</h2>
        <div className={styles.testimonialCards}>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialContent}>
              <p className={styles.testimonialText}>
                "The personality assessment provided insights that I had never considered before. It's helped me understand why I approach situations the way I do."
              </p>
            </div>
            <div className={styles.testimonialAuthor}>
              <img src="/images/testimonials/sarah.jpg" alt="Sarah J." className={styles.testimonialImage} />
              <div className={styles.testimonialInfo}>
                <h4 className={styles.testimonialName}>Sarah Johnson</h4>
                <p className={styles.testimonialRole}>Marketing Director</p>
              </div>
            </div>
          </div>
          
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialContent}>
              <p className={styles.testimonialText}>
                "As a team leader, the team dynamics assessment has been invaluable. We've improved our communication and productivity significantly."
              </p>
            </div>
            <div className={styles.testimonialAuthor}>
              <img src="/images/testimonials/michael.jpg" alt="Michael T." className={styles.testimonialImage} />
              <div className={styles.testimonialInfo}>
                <h4 className={styles.testimonialName}>Michael Thompson</h4>
                <p className={styles.testimonialRole}>Project Manager</p>
              </div>
            </div>
          </div>
          
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialContent}>
              <p className={styles.testimonialText}>
                "The leadership assessment helped me recognize my strengths and areas for growth. I'm a more effective leader because of these insights."
              </p>
            </div>
            <div className={styles.testimonialAuthor}>
              <img src="/images/testimonials/elena.jpg" alt="Elena R." className={styles.testimonialImage} />
              <div className={styles.testimonialInfo}>
                <h4 className={styles.testimonialName}>Elena Rodriguez</h4>
                <p className={styles.testimonialRole}>CEO, Innovate Tech</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Discover Your Personality Profile?</h2>
          <p className={styles.ctaDescription}>
            Take our assessment today and gain valuable insights into your unique traits and tendencies.
          </p>
          <Link to="/assessments" className={styles.ctaButton}>
            Get Started Now
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Home;