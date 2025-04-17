using PersonalityFramework.Shared.Models;

namespace PersonalityFramework.Api.Services
{
    public interface IAssessmentService
    {
        Task<List<Assessment>> GetAsync();
        Task<Assessment?> GetAsync(string id);
        Task CreateAsync(Assessment newAssessment);
        Task UpdateAsync(string id, Assessment updatedAssessment);
        Task RemoveAsync(string id);
        Task<List<Assessment>> GetByUserIdAsync(string userId);
    }
}
