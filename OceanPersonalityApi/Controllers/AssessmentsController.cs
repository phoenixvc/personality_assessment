using Microsoft.AspNetCore.Mvc;
using OceanPersonalityApi.Models;
using OceanPersonalityApi.Services;

namespace OceanPersonalityApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssessmentsController : ControllerBase
    {
        private readonly IAssessmentService _assessmentService;

        public AssessmentsController(IAssessmentService assessmentService)
        {
            _assessmentService = assessmentService;
        }

        [HttpGet]
        public async Task<List<Assessment>> Get() =>
            await _assessmentService.GetAsync();

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<Assessment>> Get(string id)
        {
            var assessment = await _assessmentService.GetAsync(id);

            if (assessment is null)
            {
                return NotFound();
            }

            return assessment;
        }

        [HttpPost]
        public async Task<IActionResult> Post(Assessment newAssessment)
        {
            await _assessmentService.CreateAsync(newAssessment);

            return CreatedAtAction(nameof(Get), new { id = newAssessment.Id }, newAssessment);
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, Assessment updatedAssessment)
        {
            var assessment = await _assessmentService.GetAsync(id);

            if (assessment is null)
            {
                return NotFound();
            }

            updatedAssessment.Id = assessment.Id;

            await _assessmentService.UpdateAsync(id, updatedAssessment);

            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            var assessment = await _assessmentService.GetAsync(id);

            if (assessment is null)
            {
                return NotFound();
            }

            await _assessmentService.RemoveAsync(id);

            return NoContent();
        }
    }
}