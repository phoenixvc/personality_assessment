using Microsoft.Extensions.Options;
using MongoDB.Driver;
using PersonalityFramework.Shared.Models;

namespace PersonalityFramework.Api.Services
{
    public class PersonaProfileService : IPersonaProfileService
    {
        private readonly IMongoCollection<PersonaProfile> _personaProfilesCollection;

        public PersonaProfileService(IOptions<DatabaseSettings> databaseSettings)
        {
            var mongoClient = new MongoClient(databaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(databaseSettings.Value.DatabaseName);
            _personaProfilesCollection = mongoDatabase.GetCollection<PersonaProfile>("personaProfiles");
        }

        public async Task<List<PersonaProfile>> GetAsync() =>
            await _personaProfilesCollection.Find(_ => true).ToListAsync();

        public async Task<PersonaProfile?> GetAsync(string id) =>
            await _personaProfilesCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(PersonaProfile newPersonaProfile) =>
            await _personaProfilesCollection.InsertOneAsync(newPersonaProfile);

        public async Task UpdateAsync(string id, PersonaProfile updatedPersonaProfile) =>
            await _personaProfilesCollection.ReplaceOneAsync(x => x.Id == id, updatedPersonaProfile);

        public async Task RemoveAsync(string id) =>
            await _personaProfilesCollection.DeleteOneAsync(x => x.Id == id);
    }
}


