
using Microsoft.EntityFrameworkCore;

namespace IncidentManagementSystemAPI.Services
{
    public class IncidentService : IIncidentService
    {
        private readonly IncidentDbContext _context;
        private readonly IConfiguration _configuration;
        public IncidentService(IncidentDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        public async Task<Incident> CreateIncidentAsync(IncidentCreateDto dto)
        {

            var incident = new Incident
            {
                Title = dto.Title,
                Description = dto.Description,
                Severity = dto.Severity,
                Status = StatusType.Open,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                FileSize = dto.FileSize
            };

            _context.Incident.Add(incident);
            await _context.SaveChangesAsync();
            return incident;
        }

        public async Task<IEnumerable<Incident>> GetAllIncidentsAsync()
        {
            return await _context.Incident.ToListAsync();
        }

        public async Task<Incident> GetIncidentAsync(int id)
        {
            return await _context.Incident.FindAsync(id);
        }

        public async Task<bool> UpdateIncidentStatusAsync(int id, StatusType status)
        {
            var incident = await _context.Incident.FindAsync(id);
            if (incident == null)
                return false;

            incident.Status = status;
            incident.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<IncidentWithFilesDto>> GetAllIncidentsWithFilesAsync()
        {
            return await _context.Incident
                        .Include(i => i.Files)
                        .Select(i => new IncidentWithFilesDto
                        {
                            IncidentId = i.IncidentId,
                            Title = i.Title,
                            Description = i.Description,
                            Severity = i.Severity,
                            Status = i.Status,
                            CreatedAt = i.CreatedAt,
                            UpdatedAt = i.UpdatedAt,
                            Files = i.Files.Select(f => new IncidentFileDto
                            {
                                IncidentFileId = f.IncidentFileId,
                                FileName = f.FileName,
                                FilePath = f.FilePath,
                                UploadedAt = f.UploadedAt
                            }).ToList()
                        })
                        .ToListAsync();
        }
    }
}
