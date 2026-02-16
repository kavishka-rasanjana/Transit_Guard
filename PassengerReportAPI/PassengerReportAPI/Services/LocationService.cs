using Microsoft.Extensions.Options;
using MongoDB.Driver;
using PassengerReportAPI.Models;

namespace PassengerReportAPI.Services
{
    public class LocationService
    {
        private readonly IMongoCollection<Location> _locationsCollection;

        public LocationService(IOptions<MongoDBSettings> mongoDBSettings)
        {
            var mongoClient = new MongoClient(mongoDBSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(mongoDBSettings.Value.DatabaseName);

            // Connects to 'Locations' collection
            _locationsCollection = mongoDatabase.GetCollection<Location>("Locations");
        }

        public async Task<List<Location>> GetAsync() =>
            await _locationsCollection.Find(_ => true).ToListAsync();

        public async Task CreateManyAsync(List<Location> locations) =>
            await _locationsCollection.InsertManyAsync(locations);
    }
}