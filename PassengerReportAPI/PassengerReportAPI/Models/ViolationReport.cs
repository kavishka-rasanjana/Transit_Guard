using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PassengerReportAPI.Models
{
    public class ViolationReport
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string PassengerName { get; set; } = string.Empty;

        public string VehicleNumber { get; set; } = string.Empty;

        public string RouteNumber { get; set; } = string.Empty;

        public string ViolationType { get; set; } = string.Empty; // Dropdown value

        public string? OtherDescription { get; set; } // If type is "Other"

        public string CurrentLocation { get; set; } = string.Empty; // Google Maps Link or Coordinates

        public List<string> EvidenceImagePaths { get; set; } = new List<string>(); // Save file paths here

        public DateTime ReportedDate { get; set; } = DateTime.Now;
    }
}