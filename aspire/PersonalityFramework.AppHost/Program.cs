var builder = DistributedApplication.CreateBuilder(args);

// Add MongoDB as a generic container resource
var mongoDb = builder.AddContainer("mongodb", "mongo:latest")
                    .WithVolume("mongodb-data", "/data/db")
                    .WithEndpoint(27017, 27017);

// Add connection string as an environment variable for the API
var mongoConnectionString = "mongodb://mongodb:27017";

// Add API project with MongoDB connection
var api = builder.AddProject<Projects.PersonalityFramework_Api>("api")
                .WithEnvironment("DatabaseSettings__ConnectionString", mongoConnectionString);

// Add Web project with reference to API
var web = builder.AddProject<Projects.PersonalityFramework_Web>("web")
                .WithReference(api);

// Build and run the application
builder.Build().Run();