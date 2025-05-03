import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface Topic {
  id: string;
  slug: string;
  title: string;
  description: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  content: string;
  topicSlug: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  url: string;
  score: number;
}

export const fetchTopics = async (): Promise<Topic[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/content/getTopics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw error;
  }
};

export const fetchArticleDetails = async (topicSlug: string, articleSlug: string): Promise<Article> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/content/getArticle`, {
      params: { topicSlug, articleSlug },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching article details:', error);
    throw error;
  }
};

export const fetchRelatedArticles = async (topicSlug: string): Promise<Article[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/content/getRelated`, {
      params: { topicSlug },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching related articles:', error);
    throw error;
  }
};

export const fetchSearchResults = async (query: string): Promise<SearchResult[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search/query`, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw error;
  }
};

export const fetchSearchSuggestions = async (query: string): Promise<string[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search/suggest`, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    throw error;
  }
};

export const logError = (error: any, context: string): void => {
  console.error(`Error in ${context}:`, error);
};

export const logInfo = (message: any, context: string): void => {
  console.log(`Info in ${context}:`, message);
};