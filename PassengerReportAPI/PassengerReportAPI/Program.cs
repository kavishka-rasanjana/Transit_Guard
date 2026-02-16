using PassengerReportAPI.Models;
using PassengerReportAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Configure MongoDB Settings
builder.Services.Configure<MongoDBSettings>(
    builder.Configuration.GetSection("MongoDBSettings"));

// 2. Register ALL 3 Services
builder.Services.AddSingleton<ViolationService>();
builder.Services.AddSingleton<ViolationTypeService>();
builder.Services.AddSingleton<LocationService>();

// 3. Add Controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 4. Configure CORS (To allow React Frontend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles(); // Enable accessing uploaded images
app.UseCors("AllowReactApp");
app.UseAuthorization();
app.MapControllers();

app.Run();