using PersonalityFramework.Shared.Models;

namespace PersonalityFramework.Api.Services
{
    public interface IUserService
    {
        Task<List<User>> GetAsync();
        Task<User?> GetAsync(string id);
        Task CreateAsync(User newUser);
        Task UpdateAsync(string id, User updatedUser);
        Task RemoveAsync(string id);
        Task<UserPreferences?> GetUserPreferencesAsync(string userId);
        Task UpdateUserPreferencesAsync(string userId, UserPreferences updatedPreferences);
    }
}