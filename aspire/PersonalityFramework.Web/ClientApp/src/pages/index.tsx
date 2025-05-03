import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import Layout from '../components/layout/Layout';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <Layout title="Goat Farming Guide" description="Your comprehensive resource for all things goat farming">
      <div className={styles.container}>
        <section className={styles.introduction}>
          <h2>Introduction to Goat Farming</h2>
          <p>Goat farming is a highly rewarding agricultural practice that provides sustainable sources of milk, meat, and fiber. This guide covers essential aspects such as selecting the right breed, housing, feeding, health management, and profitability.</p>
        </section>
        <section className={styles.topics}>
          <h2>Explore Topics</h2>
          <ul>
            <li><Link href="/topics">Topics Listing</Link></li>
            <li><Link href="/bloodlines-education">Bloodlines Education</Link></li>
            <li><Link href="/search">Search</Link></li>
            <li><Link href="/resources">Resources</Link></li>
            <li><Link href="/glossary">Glossary</Link></li>
          </ul>
        </section>
        <section className={styles.features}>
          <h2>Features</h2>
          <ul>
            <li>Health Monitoring & Maintenance</li>
            <li>Milk Quality & Storage</li>
            <li>Production Records</li>
            <li>Nutrition Management</li>
            <li>Investor Information</li>
            <li>DIY Milking Stand Plans</li>
            <li>Search Functionality</li>
            <li>Glossary</li>
          </ul>
        </section>
        <section className={styles.contact}>
          <h2>Contact Information</h2>
          <p>For more details, feel free to reach out:</p>
          <p>Email: <a href="mailto:smit.jurie@gmail.com">smit.jurie@gmail.com</a></p>
          <p>Or visit Mojo on the farm to see him milk in action (a friendly quip at a friend).</p>
        </section>
      </div>
    </Layout>
  );
};

export default Home;