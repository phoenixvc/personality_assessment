using OceanPersonalityApi.Models;

namespace OceanPersonalityApi.Services
{
    public interface IUserService
    {
        Task<List<User>> GetAsync();
        Task<User?> GetAsync(string id);
        Task CreateAsync(User newUser);
        Task UpdateAsync(string id, User updatedUser);
        Task RemoveAsync(string id);
    }
}