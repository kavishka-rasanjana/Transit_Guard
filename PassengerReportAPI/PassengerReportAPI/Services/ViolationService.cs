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

            // Connects to 'ViolationReports' collection
            _violationsCollection = mongoDatabase.GetCollection<ViolationReport>("ViolationReports");
        }

        // Saves a new report
        public async Task CreateAsync(ViolationReport newReport) =>
            await _violationsCollection.InsertOneAsync(newReport);

        // Gets all reports
        public async Task<List<ViolationReport>> GetAsync() =>
            await _violationsCollection.Find(_ => true).ToListAsync();
    }
}