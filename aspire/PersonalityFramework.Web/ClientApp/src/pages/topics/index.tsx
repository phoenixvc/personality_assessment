import { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import { fetchTopics, Topic } from '../../lib/api';
import styles from '../../styles/Topics.module.css';

const Topics: NextPage = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getTopics = async () => {
      try {
        const topicsData = await fetchTopics();
        setTopics(topicsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching topics:', err);
        setError('Failed to load topics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getTopics();
  }, []);

  return (
    <Layout title="Topics" description="Explore all goat farming topics">
      <div className={styles.container}>
        <h1 className={styles.title}>Goat Farming Topics</h1>
        
        {loading && <p className={styles.loading}>Loading topics...</p>}
        
        {error && <p className={styles.error}>{error}</p>}
        
        {!loading && !error && topics.length === 0 && (
          <p className={styles.noTopics}>No topics found.</p>
        )}

        {topics.length > 0 && (
          <div className={styles.topicsGrid}>
            {topics.map((topic) => (
              <Link href={`/topics/${topic.slug}`} key={topic.id} className={styles.topicCard}>
                <h2 className={styles.topicTitle}>{topic.title}</h2>
                <p className={styles.topicDescription}>{topic.description}</p>
                <span className={styles.readMore}>Read More →</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Topics;