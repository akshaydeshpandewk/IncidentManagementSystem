using IncidentManagementSystemAPI.Services;
using Microsoft.EntityFrameworkCore;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Replace with your actual connection string
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
            ?? "Server=(localdb)\\mssqllocaldb;Database=IncidentDb;Trusted_Connection=True;";

        builder.Services.AddDbContext<IncidentDbContext>(options =>
            options.UseSqlServer(connectionString));

        // Add services to the container.
        builder.Services.AddScoped<IIncidentService, IncidentService>();
        builder.Services.AddScoped<IFileService, FileService>();
        builder.Services.AddControllers();
        builder.Services.AddSwaggerGen();

        //CORS policy
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("MyCorsPolicy", policy =>
            {
                policy.AllowAnyOrigin() // Specify allowed origins
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            });
        });

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseCors("MyCorsPolicy");
        app.UseHttpsRedirection();

        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}