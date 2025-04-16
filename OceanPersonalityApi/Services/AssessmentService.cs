using Microsoft.Extensions.Options;
using MongoDB.Driver;
using OceanPersonalityApi.Models;

namespace OceanPersonalityApi.Services
{
    public class AssessmentService : IAssessmentService
    {
        private readonly IMongoCollection<Assessment> _assessmentsCollection;

        public AssessmentService(IOptions<DatabaseSettings> databaseSettings)
        {
            var mongoClient = new MongoClient(databaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(databaseSettings.Value.DatabaseName);
            _assessmentsCollection = mongoDatabase.GetCollection<Assessment>("assessments");
        }

        public async Task<List<Assessment>> GetAsync() =>
            await _assessmentsCollection.Find(_ => true).ToListAsync();

        public async Task<Assessment?> GetAsync(string id) =>
            await _assessmentsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Assessment newAssessment) =>
            await _assessmentsCollection.InsertOneAsync(newAssessment);

        public async Task UpdateAsync(string id, Assessment updatedAssessment) =>
            await _assessmentsCollection.ReplaceOneAsync(x => x.Id == id, updatedAssessment);

        public async Task RemoveAsync(string id) =>
            await _assessmentsCollection.DeleteOneAsync(x => x.Id == id);
    }
}