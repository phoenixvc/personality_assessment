using PersonalityFramework.Shared.Models;

namespace PersonalityFramework.Api.Services
{
    public interface IExperienceSuggestionService
    {
        Task<List<ExperienceSuggestion>> GetAsync();
        Task<ExperienceSuggestion?> GetAsync(string id);
        Task CreateAsync(ExperienceSuggestion newExperienceSuggestion);
        Task UpdateAsync(string id, ExperienceSuggestion updatedExperienceSuggestion);
        Task RemoveAsync(string id);
        Task<List<ExperienceSuggestion>> GetPersonalizedSuggestionsAsync(string userId);
    }
}