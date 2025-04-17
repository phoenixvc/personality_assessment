using Microsoft.AspNetCore.Mvc;
using OceanPersonalityApi.Models;
using OceanPersonalityApi.Services;

namespace OceanPersonalityApi.Controllers
{
    [ApiController]
    [Route("api/experience-suggestions")]
    public class ExperienceSuggestionsController : ControllerBase
    {
        private readonly IExperienceSuggestionService _experienceSuggestionService;

        public ExperienceSuggestionsController(IExperienceSuggestionService experienceSuggestionService)
        {
            _experienceSuggestionService = experienceSuggestionService;
        }

        [HttpGet]
        public async Task<List<ExperienceSuggestion>> Get() =>
            await _experienceSuggestionService.GetAsync();

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<ExperienceSuggestion>> Get(string id)
        {
            var experienceSuggestion = await _experienceSuggestionService.GetAsync(id);

            if (experienceSuggestion is null)
            {
                return NotFound();
            }

            return experienceSuggestion;
        }

        [HttpPost]
        public async Task<IActionResult> Post(ExperienceSuggestion newExperienceSuggestion)
        {
            await _experienceSuggestionService.CreateAsync(newExperienceSuggestion);

            return CreatedAtAction(nameof(Get), new { id = newExperienceSuggestion.Id }, newExperienceSuggestion);
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, ExperienceSuggestion updatedExperienceSuggestion)
        {
            var experienceSuggestion = await _experienceSuggestionService.GetAsync(id);

            if (experienceSuggestion is null)
            {
                return NotFound();
            }

            updatedExperienceSuggestion.Id = experienceSuggestion.Id;

            await _experienceSuggestionService.UpdateAsync(id, updatedExperienceSuggestion);

            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            var experienceSuggestion = await _experienceSuggestionService.GetAsync(id);

            if (experienceSuggestion is null)
            {
                return NotFound();
            }

            await _experienceSuggestionService.RemoveAsync(id);

            return NoContent();
        }

        [HttpGet("personalized/{userId}")]
        public async Task<ActionResult<List<ExperienceSuggestion>>> GetPersonalizedSuggestions(string userId)
        {
            var personalizedSuggestions = await _experienceSuggestionService.GetPersonalizedSuggestionsAsync(userId);

            if (personalizedSuggestions is null || !personalizedSuggestions.Any())
            {
                return NotFound();
            }

            return personalizedSuggestions;
        }
    }
}
