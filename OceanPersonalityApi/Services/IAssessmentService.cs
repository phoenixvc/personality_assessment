using OceanPersonalityApi.Models;

namespace OceanPersonalityApi.Services
{
    public interface IAssessmentService
    {
        Task<List<Assessment>> GetAsync();
        Task<Assessment?> GetAsync(string id);
        Task CreateAsync(Assessment newAssessment);
        Task UpdateAsync(string id, Assessment updatedAssessment);
        Task RemoveAsync(string id);
    }
}