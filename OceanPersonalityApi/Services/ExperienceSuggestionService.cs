using Microsoft.Extensions.Options;
using MongoDB.Driver;
using OceanPersonalityApi.Models;

namespace OceanPersonalityApi.Services
{
    public class ExperienceSuggestionService : IExperienceSuggestionService
    {
        private readonly IMongoCollection<ExperienceSuggestion> _experienceSuggestionsCollection;

        public ExperienceSuggestionService(IOptions<DatabaseSettings> databaseSettings)
        {
            var mongoClient = new MongoClient(databaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(databaseSettings.Value.DatabaseName);
            _experienceSuggestionsCollection = mongoDatabase.GetCollection<ExperienceSuggestion>("experienceSuggestions");
        }

        public async Task<List<ExperienceSuggestion>> GetAsync() =>
            await _experienceSuggestionsCollection.Find(_ => true).ToListAsync();

        public async Task<ExperienceSuggestion?> GetAsync(string id) =>
            await _experienceSuggestionsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(ExperienceSuggestion newExperienceSuggestion) =>
            await _experienceSuggestionsCollection.InsertOneAsync(newExperienceSuggestion);

        public async Task UpdateAsync(string id, ExperienceSuggestion updatedExperienceSuggestion) =>
            await _experienceSuggestionsCollection.ReplaceOneAsync(x => x.Id == id, updatedExperienceSuggestion);

        public async Task RemoveAsync(string id) =>
            await _experienceSuggestionsCollection.DeleteOneAsync(x => x.Id == id);
    }
}