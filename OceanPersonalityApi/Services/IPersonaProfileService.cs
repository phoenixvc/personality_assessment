using OceanPersonalityApi.Models;

namespace OceanPersonalityApi.Services
{
    public interface IPersonaProfileService
    {
        Task<List<PersonaProfile>> GetAsync();
        Task<PersonaProfile?> GetAsync(string id);
        Task CreateAsync(PersonaProfile newPersonaProfile);
        Task UpdateAsync(string id, PersonaProfile updatedPersonaProfile);
        Task RemoveAsync(string id);
    }
}