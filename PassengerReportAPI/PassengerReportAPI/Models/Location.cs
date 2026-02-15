using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PassengerReportAPI.Models
{
    public class Location
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Province { get; set; } = null!;

        public List<string> Districts { get; set; } = null!;
    }
}