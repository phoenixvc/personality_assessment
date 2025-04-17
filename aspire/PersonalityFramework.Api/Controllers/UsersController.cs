using Microsoft.AspNetCore.Mvc;
using PersonalityFramework.Shared.Models;
using PersonalityFramework.Api.Services;

namespace PersonalityFramework.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<List<User>> Get() =>
            await _userService.GetAsync();

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<User>> Get(string id)
        {
            var user = await _userService.GetAsync(id);

            if (user is null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpPost]
        public async Task<IActionResult> Post(User newUser)
        {
            await _userService.CreateAsync(newUser);

            return CreatedAtAction(nameof(Get), new { id = newUser.Id }, newUser);
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, User updatedUser)
        {
            var user = await _userService.GetAsync(id);

            if (user is null)
            {
                return NotFound();
            }

            updatedUser.Id = user.Id;

            await _userService.UpdateAsync(id, updatedUser);

            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            var user = await _userService.GetAsync(id);

            if (user is null)
            {
                return NotFound();
            }

            await _userService.RemoveAsync(id);

            return NoContent();
        }

        [HttpGet("{id:length(24)}/preferences")]
        public async Task<ActionResult<UserPreferences>> GetUserPreferences(string id)
        {
            var preferences = await _userService.GetUserPreferencesAsync(id);

            if (preferences is null)
            {
                return NotFound();
            }

            return preferences;
        }

        [HttpPut("{id:length(24)}/preferences")]
        public async Task<IActionResult> UpdateUserPreferences(string id, UserPreferences updatedPreferences)
        {
            var user = await _userService.GetAsync(id);

            if (user is null)
            {
                return NotFound();
            }

            await _userService.UpdateUserPreferencesAsync(id, updatedPreferences);

            return NoContent();
        }
    }
}



