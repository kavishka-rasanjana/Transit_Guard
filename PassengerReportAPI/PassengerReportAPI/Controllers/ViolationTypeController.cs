using Microsoft.AspNetCore.Mvc;
using PassengerReportAPI.Models;
using PassengerReportAPI.Services;

namespace PassengerReportAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ViolationTypeController : ControllerBase
    {
        private readonly ViolationTypeService _violationTypeService;

        public ViolationTypeController(ViolationTypeService violationTypeService)
        {
            _violationTypeService = violationTypeService;
        }

        [HttpGet]
        public async Task<List<ViolationType>> GetViolationTypes()
        {
            return await _violationTypeService.GetAsync();
        }

        [HttpPost("seed-data")]
        public async Task<IActionResult> SeedData()
        {
            var existingData = await _violationTypeService.GetAsync();
            if (existingData.Any()) return BadRequest("Data already exists!");

            var violations = new List<ViolationType>
            {
                new ViolationType { Name = "Drunk Driver", PriorityScore = 1 },
                new ViolationType { Name = "Drunk Conductor", PriorityScore = 1 },
                new ViolationType { Name = "Unsafe Driving", PriorityScore = 1 },
                new ViolationType { Name = "No Ticket Issued", PriorityScore = 2 },
                new ViolationType { Name = "Over Speeding", PriorityScore = 2 },
                new ViolationType { Name = "Overloading", PriorityScore = 2 },
                new ViolationType { Name = "Use Phone While Driving", PriorityScore = 2 },
                new ViolationType { Name = "Excessive Fare", PriorityScore = 3 },
                new ViolationType { Name = "Too Slow", PriorityScore = 3 }
            };

            await _violationTypeService.CreateManyAsync(violations);
            return Ok("Violation Rules Saved!");
        }
    }
}