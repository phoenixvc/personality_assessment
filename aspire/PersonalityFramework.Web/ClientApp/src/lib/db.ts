import { CosmosClient } from '@azure/cosmos';
import config from './config';

const client = new CosmosClient(config.cosmos);
const database = client.database(config.databaseId);
const container = database.container(config.containerId);

async function connectToDatabase(): Promise<void> {
  try {
    await client.databases.createIfNotExists({ id: config.databaseId });
    await database.containers.createIfNotExists({ id: config.containerId });
    console.log('Connected to database');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

export {
    client, connectToDatabase, container, database
};
