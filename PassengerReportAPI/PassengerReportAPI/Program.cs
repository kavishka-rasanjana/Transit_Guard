using PassengerReportAPI.Models;
using PassengerReportAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// ==================================================================
// 1. CONFIGURE SERVICES
// ==================================================================


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});


builder.Services.Configure<MongoDBSettings>(
    builder.Configuration.GetSection("MongoDBSettings"));


builder.Services.AddSingleton<ViolationService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<LocationService>();

var app = builder.Build();

// ==================================================================
// 2. CONFIGURE PIPELINE (Middleware)
// ==================================================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseCors("AllowReactApp");

app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.Run();