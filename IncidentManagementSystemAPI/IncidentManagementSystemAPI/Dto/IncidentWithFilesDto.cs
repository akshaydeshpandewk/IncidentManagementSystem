public class IncidentWithFilesDto
{
    public int IncidentId { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public SeverityLevel Severity { get; set; }
    public StatusType Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<IncidentFileDto> Files { get; set; }
}

public class IncidentFileDto
{
    public int IncidentFileId { get; set; }
    public string FileName { get; set; }
    public string FilePath { get; set; }
    public DateTime UploadedAt { get; set; }
}
