using Microsoft.Extensions.Options;
using MongoDB.Driver;
using PersonalityFramework.Shared.Models;

namespace PersonalityFramework.Api.Services
{
    public class UserService : IUserService
    {
        private readonly IMongoCollection<User> _usersCollection;
        private readonly IMongoCollection<UserPreferences> _preferencesCollection;

        public UserService(IOptions<DatabaseSettings> databaseSettings)
        {
            var mongoClient = new MongoClient(databaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(databaseSettings.Value.DatabaseName);
            _usersCollection = mongoDatabase.GetCollection<User>("users");
            _preferencesCollection = mongoDatabase.GetCollection<UserPreferences>("userPreferences");
        }

        public async Task<List<User>> GetAsync() =>
            await _usersCollection.Find(_ => true).ToListAsync();

        public async Task<User?> GetAsync(string id) =>
            await _usersCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(User newUser) =>
            await _usersCollection.InsertOneAsync(newUser);

        public async Task UpdateAsync(string id, User updatedUser) =>
            await _usersCollection.ReplaceOneAsync(x => x.Id == id, updatedUser);

        public async Task RemoveAsync(string id) =>
            await _usersCollection.DeleteOneAsync(x => x.Id == id);

        public async Task<UserPreferences?> GetUserPreferencesAsync(string userId)
        {
            var preferences = await _preferencesCollection.Find(x => x.UserId == userId).FirstOrDefaultAsync();

            if (preferences == null)
            {
                // Return default preferences if none exist
                preferences = new UserPreferences
                {
                    UserId = userId,
                    Theme = "light",
                    NotificationsEnabled = true,
                    FeatureToggles = new Dictionary<string, bool>(),
                    CustomSettings = new Dictionary<string, string>()
                };

                // Save default preferences
                await _preferencesCollection.InsertOneAsync(preferences);
            }

            return preferences;
        }

        public async Task UpdateUserPreferencesAsync(string userId, UserPreferences updatedPreferences)
        {
            updatedPreferences.UserId = userId;

            var existingPreferences = await _preferencesCollection.Find(x => x.UserId == userId).FirstOrDefaultAsync();

            if (existingPreferences != null)
            {
                await _preferencesCollection.ReplaceOneAsync(x => x.UserId == userId, updatedPreferences);
            }
            else
            {
                await _preferencesCollection.InsertOneAsync(updatedPreferences);
            }
        }
    }
}