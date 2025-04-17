using Microsoft.Extensions.Options;
using MongoDB.Driver;
using PersonalityFramework.Shared.Models;

namespace PersonalityFramework.Api.Services
{
    public class ExperienceSuggestionService : IExperienceSuggestionService
    {
        private readonly IMongoCollection<ExperienceSuggestion> _experienceSuggestionsCollection;
        private readonly IMongoCollection<Assessment> _assessmentsCollection;
        private readonly IMongoCollection<User> _usersCollection;

        public ExperienceSuggestionService(IOptions<DatabaseSettings> databaseSettings)
        {
            var mongoClient = new MongoClient(databaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(databaseSettings.Value.DatabaseName);
            _experienceSuggestionsCollection = mongoDatabase.GetCollection<ExperienceSuggestion>("experienceSuggestions");
            _assessmentsCollection = mongoDatabase.GetCollection<Assessment>("assessments");
            _usersCollection = mongoDatabase.GetCollection<User>("users");
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

        public async Task<List<ExperienceSuggestion>> GetPersonalizedSuggestionsAsync(string userId)
        {
            // Get the user's latest assessment
            var userAssessments = await _assessmentsCollection
                .Find(a => a.UserId == userId)
                .SortByDescending(a => a.CompletedDate)
                .ToListAsync();

            var latestAssessment = userAssessments.FirstOrDefault();

            // If no assessment is found, return general suggestions
            if (latestAssessment == null)
            {
                return await _experienceSuggestionsCollection
                    .Find(_ => true)
                    .Limit(5)
                    .ToListAsync();
            }

            // Get user data to further personalize suggestions
            var user = await _usersCollection.Find(u => u.Id == userId).FirstOrDefaultAsync();

            // Create a filter based on the user's personality traits from their assessment
            var personalityTraits = latestAssessment.PersonalityTraits ?? new Dictionary<string, double>();

            // Find suggestions that match the user's top personality traits
            var personalizedSuggestions = new List<ExperienceSuggestion>();

            // Get all suggestions
            var allSuggestions = await _experienceSuggestionsCollection.Find(_ => true).ToListAsync();

            // Score each suggestion based on how well it matches the user's personality traits
            var scoredSuggestions = allSuggestions.Select(suggestion =>
            {
                double matchScore = 0;

                // Calculate match score based on personality trait alignment
                foreach (var trait in personalityTraits)
                {
                    if (suggestion.PersonalityTraitScores.TryGetValue(trait.Key, out double traitScore))
                    {
                        // Higher score for closer trait matches
                        matchScore += (1 - Math.Abs(trait.Value - traitScore)) * 10;
                    }
                }

                // Add bonus points for category preferences if user has any
                if (user != null && user.Preferences != null &&
                    user.Preferences.TryGetValue("preferredCategories", out var preferredCategoriesJson))
                {
                    var preferredCategories = System.Text.Json.JsonSerializer.Deserialize<List<string>>(preferredCategoriesJson);
                    if (preferredCategories != null && !string.IsNullOrEmpty(suggestion.Category) &&
                        preferredCategories.Contains(suggestion.Category))
                    {
                        matchScore += 5;
                    }
                }

                return new { Suggestion = suggestion, Score = matchScore };
            })
            .OrderByDescending(item => item.Score)
            .Take(10)
            .Select(item =>
            {
                // Set the recommendation score on the suggestion before returning
                item.Suggestion.RecommendationScore = (int)Math.Round(item.Score);
                return item.Suggestion;
            })
            .ToList();

            return scoredSuggestions;
        }
    }
}