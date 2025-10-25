using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Incident
{
    public int IncidentId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Title { get; set; }

    [MaxLength(500)]
    public string Description { get; set; }

    [Required]
    [EnumDataType(typeof(SeverityLevel))]
    public SeverityLevel Severity { get; set; }

    [Required]
    [EnumDataType(typeof(StatusType))]
    public StatusType Status { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    [Required]
    [NotMapped]
    public int FileSize { get; set; }

    public virtual ICollection<IncidentFile> Files { get; set; }
}

public enum SeverityLevel
{
    Low,
    Medium,
    High
}

public enum StatusType
{
    Open,
    InProgress,
    Resolved
}
public class IncidentFile
{
    public int IncidentFileId { get; set; }

    public int IncidentId { get; set; } // Foreign key of Incident

    [Required]
    public string FileName { get; set; }

    [Required]
    public string FilePath { get; set; } // Store the file path or URL

    public DateTime UploadedAt { get; set; }
    public Incident Incident { get; set; }

}