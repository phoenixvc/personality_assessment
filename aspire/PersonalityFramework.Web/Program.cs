using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults from Aspire
builder.AddServiceDefaults();

// Add services to the container
builder.Services.AddControllersWithViews();

// Configure HttpClient for API communication
builder.Services.AddHttpClient("PersonalityFrameworkApi", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["ApiServiceUrl"] ?? "http://localhost:5000");
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (!app.Environment.IsDevelopment())
{
    // In production, serve the React app as static files
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}
else
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

// Map Aspire service endpoints
app.MapDefaultEndpoints();

// In development, use the React development server
if (app.Environment.IsDevelopment())
{
    app.UseSpa(spa =>
    {
        spa.Options.SourcePath = "ClientApp";
        spa.UseReactDevelopmentServer(npmScript: "start");
    });
}
else
{
    // In production, serve the SPA from the ClientApp/build directory
    app.UseSpa(spa =>
    {
        spa.Options.SourcePath = "ClientApp";
    });
}

app.Run();