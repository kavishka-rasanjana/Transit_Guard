using Microsoft.Extensions.Options;
using MongoDB.Driver;
using PassengerReportAPI.Models;

namespace PassengerReportAPI.Services
{
    public class ViolationTypeService
    {
        private readonly IMongoCollection<ViolationType> _violationCollection;

        public ViolationTypeService(IOptions<MongoDBSettings> mongoDBSettings)
        {
            var mongoClient = new MongoClient(mongoDBSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(mongoDBSettings.Value.DatabaseName);

            // Connects to 'ViolationTypes' collection
            _violationCollection = mongoDatabase.GetCollection<ViolationType>("ViolationTypes");
        }

        public async Task<List<ViolationType>> GetAsync() =>
            await _violationCollection.Find(_ => true).ToListAsync();

        public async Task CreateManyAsync(List<ViolationType> violations) =>
            await _violationCollection.InsertManyAsync(violations);
    }
}