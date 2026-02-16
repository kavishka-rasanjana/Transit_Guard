using Microsoft.AspNetCore.Mvc;
using PassengerReportAPI.Models;
using PassengerReportAPI.Services;

namespace PassengerReportAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly ViolationService _violationService;
        private readonly IWebHostEnvironment _environment;

        public ReportController(ViolationService violationService, IWebHostEnvironment environment)
        {
            _violationService = violationService;
            _environment = environment;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromForm] ReportDto reportDto)
        {
            var violationReport = new ViolationReport
            {
                PassengerName = reportDto.PassengerName,
                VehicleNumber = reportDto.VehicleNumber,
                RouteNumber = reportDto.RouteNumber,
                ViolationType = reportDto.ViolationType,
                OtherDescription = reportDto.OtherDescription,
                CurrentLocation = reportDto.CurrentLocation,
                Priority = reportDto.Priority,
                Province = reportDto.Province,
                District = reportDto.District
            };

            if (reportDto.EvidenceFiles != null && reportDto.EvidenceFiles.Count > 0)
            {
                string uploadFolder = Path.Combine(_environment.WebRootPath, "uploads");
                if (!Directory.Exists(uploadFolder)) Directory.CreateDirectory(uploadFolder);

                foreach (var file in reportDto.EvidenceFiles)
                {
                    string uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
                    string filePath = Path.Combine(uploadFolder, uniqueFileName);
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(fileStream);
                    }
                    violationReport.EvidenceImagePaths.Add("uploads/" + uniqueFileName);
                }
            }

            await _violationService.CreateAsync(violationReport);
            return Ok(new { message = "Report submitted successfully!" });
        }
    }

    public class ReportDto
    {
        public string PassengerName { get; set; }
        public string VehicleNumber { get; set; }
        public string RouteNumber { get; set; }
        public string ViolationType { get; set; }
        public string? OtherDescription { get; set; }
        public string CurrentLocation { get; set; }
        public int Priority { get; set; }
        public string Province { get; set; }
        public string District { get; set; }
        public List<IFormFile>? EvidenceFiles { get; set; }
    }
}