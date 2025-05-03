import { NextApiRequest, NextApiResponse } from 'next';
import config from '../../../lib/config';
import axios from 'axios';

interface SearchResponse {
  value: Array<{
    id: string;
    title: string;
    content: string;
    url: string;
    score: number;
  }>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req.query;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const response = await axios.get(
      `${config.searchEndpoint}/indexes/${config.searchIndexName}/docs`,
      {
        params: {
          search: query,
          api-version: '2020-06-30',
        },
        headers: {
          'api-key': config.searchApiKey,
        },
      }
    );

    const searchResults = response.data as SearchResponse;
    
    const formattedResults = searchResults.value.map((result) => ({
      id: result.id,
      title: result.title,
      snippet: result.content.substring(0, 150) + '...',
      url: result.url,
      score: result.score,
    }));

    res.status(200).json(formattedResults);
  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({ error: 'Failed to perform search' });
  }
}