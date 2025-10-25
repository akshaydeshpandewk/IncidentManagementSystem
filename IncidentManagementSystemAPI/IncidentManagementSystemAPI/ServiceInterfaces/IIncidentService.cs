public interface IIncidentService
{
    Task<Incident> CreateIncidentAsync(IncidentCreateDto dto);
    Task<Incident> GetIncidentAsync(int id);
    Task<IEnumerable<Incident>> GetAllIncidentsAsync();
    Task<bool> UpdateIncidentStatusAsync(int id, StatusType status);
    Task<IEnumerable<IncidentWithFilesDto>> GetAllIncidentsWithFilesAsync();
}

public interface IFileService
{
    Task<IncidentFile> UploadFileAsync(int incidentId, IFormFile file);

    Task<List<IncidentFile>> HandleFileUploads(IncidentCreateDto dto, Incident incident);
}
