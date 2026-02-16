using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PassengerReportAPI.Models
{
    public class ViolationType
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Name { get; set; } = string.Empty;

        // 1=High, 2=Medium, 3=Low
        public int PriorityScore { get; set; }
    }
}