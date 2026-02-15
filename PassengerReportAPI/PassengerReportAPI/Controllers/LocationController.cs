using Microsoft.AspNetCore.Mvc;
using PassengerReportAPI.Models;
using PassengerReportAPI.Services;

namespace PassengerReportAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationController : ControllerBase
    {
        private readonly LocationService _locationService;

        public LocationController(LocationService locationService)
        {
            _locationService = locationService;
        }

        
        [HttpGet]
        public async Task<List<Location>> GetLocations()
        {
            return await _locationService.GetAsync();
        }

       
        [HttpPost("seed-data")]
        public async Task<IActionResult> SeedData()
        {
            
            var existingData = await _locationService.GetAsync();
            if (existingData.Any())
            {
                return BadRequest("Data already exists inside Database!");
            }

            
            var locations = new List<Location>
            {
                new Location { Province = "Western", Districts = new List<string> { "Colombo", "Gampaha", "Kalutara" } },
                new Location { Province = "Central", Districts = new List<string> { "Kandy", "Matale", "Nuwara Eliya" } },
                new Location { Province = "Southern", Districts = new List<string> { "Galle", "Matara", "Hambantota" } },
                new Location { Province = "Northern", Districts = new List<string> { "Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu" } },
                new Location { Province = "Eastern", Districts = new List<string> { "Batticaloa", "Ampara", "Trincomalee" } },
                new Location { Province = "North Western", Districts = new List<string> { "Kurunegala", "Puttalam" } },
                new Location { Province = "North Central", Districts = new List<string> { "Anuradhapura", "Polonnaruwa" } },
                new Location { Province = "Uva", Districts = new List<string> { "Badulla", "Monaragala" } },
                new Location { Province = "Sabaragamuwa", Districts = new List<string> { "Ratnapura", "Kegalle" } }
            };

            await _locationService.CreateManyAsync(locations);
            return Ok("Data Saved to MongoDB Successfully!");
        }
    }
}