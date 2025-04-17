using PersonalityFramework.Api.Services;
using PersonalityFramework.Shared.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<DatabaseSettings>(
    builder.Configuration.GetSection("DatabaseSettings"));

// Register services
builder.Services.AddSingleton<IAssessmentService, AssessmentService>();
builder.Services.AddSingleton<IPersonaProfileService, PersonaProfileService>();
builder.Services.AddSingleton<IExperienceSuggestionService, ExperienceSuggestionService>();
builder.Services.AddSingleton<IUserService, UserService>();

// Add controllers
builder.Services.AddControllers();

// Add Swagger/OpenAPI support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add Aspire service defaults
builder.AddServiceDefaults();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthorization();
app.MapControllers();

// Map Aspire service endpoints
app.MapDefaultEndpoints();

app.Run();