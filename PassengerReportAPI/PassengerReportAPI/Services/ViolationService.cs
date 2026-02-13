using Microsoft.Extensions.Options;
using MongoDB.Driver;
using PassengerReportAPI.Models;

namespace PassengerReportAPI.Services
{
    public class ViolationService
    {
        private readonly IMongoCollection<ViolationReport> _violationsCollection;

        public ViolationService(IOptions<MongoDBSettings> mongoDBSettings)
        {
            var mongoClient = new MongoClient(mongoDBSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(mongoDBSettings.Value.DatabaseName);

            _violationsCollection = mongoDatabase.GetCollection<ViolationReport>(
                mongoDBSettings.Value.CollectionName);
        }

        // Data Save function 
        public async Task CreateAsync(ViolationReport newReport) =>
            await _violationsCollection.InsertOneAsync(newReport);

        // ALL data Function
        public async Task<List<ViolationReport>> GetAsync() =>
            await _violationsCollection.Find(_ => true).ToListAsync();
    }
}