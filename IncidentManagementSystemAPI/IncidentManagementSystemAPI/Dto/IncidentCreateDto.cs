public class IncidentCreateDto
{
    public string Title { get; set; }
    public string Description { get; set; }
    public SeverityLevel Severity { get; set; }
    public int FileSize { get; set; }

    public List<IFormFile> Files { get; set; } // For file uploads
}
