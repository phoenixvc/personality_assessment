import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../../components/layout/Layout';
import { Article, fetchArticleDetails } from '../../../lib/api';
import styles from '../../../styles/ArticleDetail.module.css';

interface ArticleDetailProps {
  article: Article;
  topicSlug: string;
  articleSlug: string;
}

const ArticleDetail: NextPage<ArticleDetailProps> = ({ article, topicSlug, articleSlug }) => {
  const router = useRouter();

  // If the page is still generating via SSR
  if (router.isFallback) {
    return (
      <Layout title="Loading...">
        <div className={styles.container}>
          <p className={styles.loading}>Loading article...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title={`${article.title} - Goat Farming Guide`}
      description={`${article.content.substring(0, 160)}...`}
    >
      <div className={styles.container}>
        <article className={styles.article}>
          <header className={styles.articleHeader}>
            <h1 className={styles.articleTitle}>{article.title}</h1>
            <div className={styles.articleMeta}>
              <time dateTime={article.createdAt} className={styles.articleDate}>
                Published: {new Date(article.createdAt).toLocaleDateString()}
              </time>
              {article.updatedAt !== article.createdAt && (
                <time dateTime={article.updatedAt} className={styles.articleDate}>
                  Updated: {new Date(article.updatedAt).toLocaleDateString()}
                </time>
              )}
            </div>
          </header>

          <div 
            className={styles.articleContent}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { topicSlug, articleSlug } = context.params || {};
  
  if (!topicSlug || !articleSlug || typeof topicSlug !== 'string' || typeof articleSlug !== 'string') {
    return {
      notFound: true,
    };
  }

  try {
    const article = await fetchArticleDetails(topicSlug, articleSlug);
    
    return {
      props: {
        article,
        topicSlug,
        articleSlug,
      },
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    return {
      notFound: true,
    };
  }
};

export default ArticleDetail;