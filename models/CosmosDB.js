const { CosmosClient } = require('@azure/cosmos');

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const client = new CosmosClient({ endpoint, key });

const databaseId = 'OCEANPersonalityDynamics';
const containerIds = {
  users: 'Users',
  assessments: 'Assessments',
  personaProfiles: 'PersonaProfiles',
  experienceSuggestions: 'ExperienceSuggestions',
};

async function createDatabase() {
  const { database } = await client.databases.createIfNotExists({ id: databaseId });
  console.log(`Created database:\n${database.id}\n`);
}

async function createContainer(containerId) {
  const { container } = await client.database(databaseId).containers.createIfNotExists({ id: containerId });
  console.log(`Created container:\n${container.id}\n`);
}

async function createContainers() {
  for (const containerId of Object.values(containerIds)) {
    await createContainer(containerId);
  }
}

async function addItem(containerId, item) {
  const { resource: createdItem } = await client.database(databaseId).container(containerId).items.create(item);
  console.log(`Created item:\n${createdItem.id}\n`);
  return createdItem;
}

async function getItem(containerId, itemId) {
  const { resource: item } = await client.database(databaseId).container(containerId).item(itemId).read();
  console.log(`Read item:\n${item.id}\n`);
  return item;
}

async function updateItem(containerId, itemId, updatedItem) {
  const { resource: item } = await client.database(databaseId).container(containerId).item(itemId).replace(updatedItem);
  console.log(`Updated item:\n${item.id}\n`);
  return item;
}

async function deleteItem(containerId, itemId) {
  await client.database(databaseId).container(containerId).item(itemId).delete();
  console.log(`Deleted item:\n${itemId}\n`);
}

module.exports = {
  createDatabase,
  createContainers,
  addItem,
  getItem,
  updateItem,
  deleteItem,
};
