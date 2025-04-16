using Microsoft.AspNetCore.Mvc;
using OceanPersonalityApi.Models;
using OceanPersonalityApi.Services;

namespace OceanPersonalityApi.Controllers
{
    [ApiController]
    [Route("api/persona-profiles")]
    public class PersonaProfilesController : ControllerBase
    {
        private readonly IPersonaProfileService _personaProfileService;

        public PersonaProfilesController(IPersonaProfileService personaProfileService)
        {
            _personaProfileService = personaProfileService;
        }

        [HttpGet]
        public async Task<List<PersonaProfile>> Get() =>
            await _personaProfileService.GetAsync();

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<PersonaProfile>> Get(string id)
        {
            var personaProfile = await _personaProfileService.GetAsync(id);

            if (personaProfile is null)
            {
                return NotFound();
            }

            return personaProfile;
        }

        [HttpPost]
        public async Task<IActionResult> Post(PersonaProfile newPersonaProfile)
        {
            await _personaProfileService.CreateAsync(newPersonaProfile);

            return CreatedAtAction(nameof(Get), new { id = newPersonaProfile.Id }, newPersonaProfile);
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, PersonaProfile updatedPersonaProfile)
        {
            var personaProfile = await _personaProfileService.GetAsync(id);

            if (personaProfile is null)
            {
                return NotFound();
            }

            updatedPersonaProfile.Id = personaProfile.Id;

            await _personaProfileService.UpdateAsync(id, updatedPersonaProfile);

            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            var personaProfile = await _personaProfileService.GetAsync(id);

            if (personaProfile is null)
            {
                return NotFound();
            }

            await _personaProfileService.RemoveAsync(id);

            return NoContent();
        }
    }
}