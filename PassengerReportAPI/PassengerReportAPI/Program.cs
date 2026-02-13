using PassengerReportAPI.Models;
using PassengerReportAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// ==================================================================
// 1. CONFIGURE SERVICES (Dependency Injection Container)
// ==================================================================

// Add CORS (Cross-Origin Resource Sharing) services.
// This is required to allow the React Frontend to communicate with this Backend.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            // Specifies that only the React app running on this URL can access the API.
            // Note: For mobile testing, you might need to use .AllowAnyOrigin() temporarily.
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()  // Allows any HTTP headers (e.g., Content-Type)
                  .AllowAnyMethod(); // Allows any HTTP methods (GET, POST, PUT, DELETE)
        });
});

// Configure MongoDB settings by reading from appsettings.json
// This binds the JSON configuration to the MongoDBSettings class.
builder.Services.Configure<MongoDBSettings>(
    builder.Configuration.GetSection("MongoDBSettings"));

// Register the ViolationService as a Singleton.
// 'Singleton' means a single instance of the service is created and used throughout the application.
builder.Services.AddSingleton<ViolationService>();

// Add services for Controllers (to handle API endpoints).
builder.Services.AddControllers();

// Add Swagger/OpenAPI support for testing the API via the browser.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ==================================================================
// 2. CONFIGURE HTTP REQUEST PIPELINE (Middleware)
// ==================================================================

// Configure the HTTP request pipeline for development environments.
if (app.Environment.IsDevelopment())
{
    // Enable Swagger UI to test API endpoints easily.
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Apply the CORS policy defined above ("AllowReactApp").
// IMPORTANT: This must be placed before UseAuthorization and UseStaticFiles.
app.UseCors("AllowReactApp");

// Enable Static Files Middleware.
// This allows the application to serve files (like uploaded images) from the 'wwwroot' folder.
app.UseStaticFiles();

app.UseAuthorization();

// Map the controller endpoints so they can be accessed via HTTP requests.
app.MapControllers();

// Start the application.
app.Run();