interface Config {
    cosmos: string;
    databaseId: string;
    containerId: string;
    searchApiKey: string;
    searchEndpoint: string;
    searchIndexName: string;
  }
  
  const config: Config = {
    cosmos: process.env.COSMOS_CONNECTION_STRING || '',
    databaseId: process.env.COSMOS_DATABASE_ID || 'goat-farming',
    containerId: process.env.COSMOS_CONTAINER_ID || 'content',
    searchApiKey: process.env.SEARCH_API_KEY || '',
    searchEndpoint: process.env.SEARCH_ENDPOINT || '',
    searchIndexName: process.env.SEARCH_INDEX_NAME || 'goat-farming-index'
  };
  
  export default config;