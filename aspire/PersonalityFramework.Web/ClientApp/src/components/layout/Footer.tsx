import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/Layout.module.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerColumn}>
            <h3 className={styles.footerHeading}>Personality Framework</h3>
            <p className={styles.footerText}>
              Discover your unique personality traits and leverage them for personal and professional growth.
            </p>
          </div>

          <div className={styles.footerColumn}>
            <h3 className={styles.footerHeading}>Quick Links</h3>
            <ul className={styles.footerLinks}>
              <li><Link to="/" className={styles.footerLink}>Home</Link></li>
              <li><Link to="/assessments" className={styles.footerLink}>Assessments</Link></li>
              <li><Link to="/profiles" className={styles.footerLink}>Profiles</Link></li>
              <li><Link to="/about" className={styles.footerLink}>About</Link></li>
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h3 className={styles.footerHeading}>Resources</h3>
            <ul className={styles.footerLinks}>
              <li><Link to="/blog" className={styles.footerLink}>Blog</Link></li>
              <li><Link to="/research" className={styles.footerLink}>Research</Link></li>
              <li><Link to="/faq" className={styles.footerLink}>FAQ</Link></li>
              <li><Link to="/support" className={styles.footerLink}>Support</Link></li>
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h3 className={styles.footerHeading}>Contact</h3>
            <ul className={styles.footerLinks}>
              <li><a href="mailto:info@personalityframework.com" className={styles.footerLink}>Email Us</a></li>
              <li><Link to="/contact" className={styles.footerLink}>Contact Form</Link></li>
              <li><a href="tel:+1234567890" className={styles.footerLink}>Call Us</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            &copy; {currentYear} Personality Framework. All rights reserved.
          </p>
          <div className={styles.legalLinks}>
            <Link to="/privacy" className={styles.legalLink}>Privacy Policy</Link>
            <Link to="/terms" className={styles.legalLink}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;