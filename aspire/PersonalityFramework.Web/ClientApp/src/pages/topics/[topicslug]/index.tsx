import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../../components/layout/Layout';
import { Article, fetchRelatedArticles } from '../../../lib/api';
import styles from '../../../styles/TopicDetail.module.css';

interface TopicDetailProps {
  topicSlug: string;
}

const TopicDetail: NextPage<TopicDetailProps> = ({ topicSlug }) => {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getArticles = async () => {
      try {
        const articlesData = await fetchRelatedArticles(topicSlug);
        setArticles(articlesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('Failed to load articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (topicSlug) {
      getArticles();
    }
  }, [topicSlug]);

  // Format the topic name for display (convert slug to title case)
  const formatTopicName = (slug: string): string => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Layout 
      title={`${formatTopicName(topicSlug)} - Goat Farming Guide`} 
      description={`Learn about ${formatTopicName(topicSlug)} in goat farming`}
    >
      <div className={styles.container}>
        <h1 className={styles.title}>{formatTopicName(topicSlug)}</h1>
        
        {loading && <p className={styles.loading}>Loading articles...</p>}
        
        {error && <p className={styles.error}>{error}</p>}
        
        {!loading && !error && articles.length === 0 && (
          <p className={styles.noArticles}>No articles found for this topic.</p>
        )}

        {articles.length > 0 && (
          <div className={styles.articlesGrid}>
            {articles.map((article) => (
              <Link 
                href={`/topics/${topicSlug}/${article.slug}`} 
                key={article.id} 
                className={styles.articleCard}
              >
                <h2 className={styles.articleTitle}>{article.title}</h2>
                <p className={styles.articlePreview}>
                  {article.content.substring(0, 150)}...
                </p>
                <div className={styles.articleMeta}>
                  <span className={styles.articleDate}>
                    {new Date(article.createdAt).toLocaleDateString()}
                  </span>
                  <span className={styles.readMore}>Read More →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { topicSlug } = context.params || {};
  
  if (!topicSlug || typeof topicSlug !== 'string') {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      topicSlug,
    },
  };
};

export default TopicDetail;