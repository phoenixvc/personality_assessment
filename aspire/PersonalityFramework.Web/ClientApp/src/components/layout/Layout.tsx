import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import styles from '../../styles/Layout.module.css';
import Footer from './Footer';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  bannerImage?: string;
  toggleDarkMode?: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  subtitle,
  bannerImage,
  toggleDarkMode
}) => {
  return (
    <HelmetProvider>
      <div className={styles.layoutContainer}>
        <Helmet>
        <title>{title} | Personality Framework</title>
        <meta name="description" content={subtitle || 'Personality Framework - Discover your unique personality traits'} />
      </Helmet>

      <Header toggleDarkMode={toggleDarkMode} />

      {bannerImage && (
        <div 
          className={styles.banner}
          style={{ backgroundImage: `url(${bannerImage})` }}
        >
          <div className={styles.bannerContent}>
            <h1 className={styles.bannerTitle}>{title}</h1>
            </div>
          </div>
        )}
      {!bannerImage && (title || subtitle) && (
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>{title}</h1>
          {subtitle && <p className={styles.pageSubtitle}>{subtitle}</p>}
        </div>
      )}

      <main className={styles.mainContent}>
        {children}
      </main>

      <Footer />
    </div>
    </HelmetProvider>
  );
};

export default Layout;