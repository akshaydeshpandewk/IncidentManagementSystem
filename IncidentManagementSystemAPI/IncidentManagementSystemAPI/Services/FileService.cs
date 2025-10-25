
namespace IncidentManagementSystemAPI.Services
{
    public class FileService : IFileService
    {
        private readonly IncidentDbContext _context;
        private readonly IWebHostEnvironment _env;

        public FileService(IncidentDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task<IncidentFile> UploadFileAsync(int incidentId, IFormFile file)
        {
            var incident = await _context.Incident.FindAsync(incidentId);
            if (incident == null || file == null || file.Length == 0)
                return null;

            var uploadsFolder = Path.Combine(_env.ContentRootPath, "Uploads", incidentId.ToString());
            Directory.CreateDirectory(uploadsFolder);

            var filePath = Path.Combine(uploadsFolder, file.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var incidentFile = new IncidentFile
            {
                FileName = file.FileName,
                FilePath = filePath,
                UploadedAt = DateTime.UtcNow,
                IncidentId = incidentId
            };

            _context.IncidentFile.Add(incidentFile);
            await _context.SaveChangesAsync();

            return incidentFile;
        }

        public async Task<List<IncidentFile>> HandleFileUploads(IncidentCreateDto dto, Incident incident)
        {
            var uploadedFiles = new List<IncidentFile>();
            if (dto.Files != null && dto.Files.Count > 0)
            {
                var uploadsFolder = Path.Combine(_env.ContentRootPath, "Uploads", incident.IncidentId.ToString());
                Directory.CreateDirectory(uploadsFolder);

                foreach (var file in dto.Files)
                {
                    var filePath = Path.Combine(uploadsFolder, file.FileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    var incidentFile = new IncidentFile
                    {
                        FileName = file.FileName,
                        FilePath = filePath,
                        UploadedAt = DateTime.UtcNow,
                        IncidentId = incident.IncidentId
                    };
                    uploadedFiles.Add(incidentFile);
                    _context.IncidentFile.Add(incidentFile);
                    await _context.SaveChangesAsync();
                }
            }
            return uploadedFiles;
        }
    }
}
