using Microsoft.EntityFrameworkCore;

public class IncidentDbContext : DbContext
{
    public IncidentDbContext(DbContextOptions<IncidentDbContext> options) : base(options) { }

    public DbSet<Incident> Incident { get; set; }
    public DbSet<IncidentFile> IncidentFile { get; set; }
}
