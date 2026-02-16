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
        public string ViolationType { get; set; } = string.Empty;
        public string? OtherDescription { get; set; }
        public string CurrentLocation { get; set; } = string.Empty;

        // Image Paths
        public List<string> EvidenceImagePaths { get; set; } = new List<string>();
        public DateTime ReportedDate { get; set; } = DateTime.Now;

        // Priority & Location Fields
        public int Priority { get; set; }
        public string Province { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
    }
}