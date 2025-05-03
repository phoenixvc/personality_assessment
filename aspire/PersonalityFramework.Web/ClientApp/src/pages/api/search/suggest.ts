import { NextApiRequest, NextApiResponse } from 'next';
import config from '../../../lib/config';
import axios from 'axios';

interface SuggestResponse {
  value: Array<{
    text: string;
    queryPlusText: string;
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
      `${config.searchEndpoint}/indexes/${config.searchIndexName}/docs/suggest`,
      {
        params: {
          search: query,
          suggesterName: 'sg',
          api-version: '2020-06-30',
        },
        headers: {
          'api-key': config.searchApiKey,
        },
      }
    );

    const suggestResults = response.data as SuggestResponse;
    const suggestions = suggestResults.value.map(item => item.text);
    
    res.status(200).json(suggestions);
  } catch (error) {
    console.error('Suggest API error:', error);
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
}