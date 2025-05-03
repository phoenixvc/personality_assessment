import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SearchBar from '../components/common/SearchBar';
import { fetchSearchResults, SearchResult } from '../lib/api';
import styles from '../styles/Search.module.css';

const Search: NextPage = () => {
  const router = useRouter();
  const { query } = router.query;
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performSearch = async () => {
      if (query && typeof query === 'string') {
        setLoading(true);
        try {
          const results = await fetchSearchResults(query);
          setSearchResults(results);
          setError(null);
        } catch (err) {
          console.error('Error searching:', err);
          setError('Failed to perform search. Please try again.');
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      }
    };

    performSearch();
  }, [query]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Search Results</h1>
      
      <div className={styles.searchBarContainer}>
        <SearchBar initialQuery={typeof query === 'string' ? query : ''} />
      </div>

      {loading && <p className={styles.loading}>Loading results...</p>}
      
      {error && <p className={styles.error}>{error}</p>}
      
      {!loading && !error && searchResults.length === 0 && query && (
        <p className={styles.noResults}>No results found for "{query}"</p>
      )}

      {searchResults.length > 0 && (
        <div className={styles.results}>
          <p className={styles.resultCount}>
            Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
          </p>
          <ul className={styles.resultsList}>
            {searchResults.map((result) => (
              <li key={result.id} className={styles.resultItem}>
                <Link href={result.url}>
                  <h2 className={styles.resultTitle}>{result.title}</h2>
                </Link>
                <p className={styles.resultSnippet}>{result.snippet}</p>
                <Link href={result.url} className={styles.resultLink}>
                  Read more
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;