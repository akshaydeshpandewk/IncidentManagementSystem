using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Configuration;

[ApiController]
[Route("api/[controller]")]
public class IncidentsController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IIncidentService _incidentService;
    private readonly IFileService _fileService;
    private readonly string _allowedFileSize;

    public IncidentsController(IncidentDbContext context, IConfiguration configuration, IIncidentService incidentService, IFileService fileService)
    {
        _configuration = configuration;
        _incidentService = incidentService;
        _fileService = fileService;
        _allowedFileSize = _configuration["AllowedFileSizeInBytes"];
    }

    // Create an incident
    [HttpPost("create")]
    public async Task<IActionResult> CreateIncident([FromBody] IncidentCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
      
        if (int.Parse(_allowedFileSize) < dto.FileSize)
            return BadRequest(new
            {
                HasError = true,
                ErrorDescription = $"File size must be less than {_allowedFileSize} bytes"
            });

        var incident = await _incidentService.CreateIncidentAsync(dto);
        return CreatedAtAction(nameof(GetIncident), new { id = incident.IncidentId }, incident);
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadDocument([FromForm] int incidentId, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { HasError = true, ErrorDescription = "File size must be larger than 0 KB" });

        var incidentFile = await _fileService.UploadFileAsync(incidentId, file);
        if (incidentFile == null)
            return NotFound(new { HasError = true, ErrorDescription = "Incident not found" });

        return Ok(new
        {
            HasError = false,
            FileId = incidentFile.IncidentFileId,
            FileName = incidentFile.FileName,
            FilePath = incidentFile.FilePath
        });
    }

    // List all incidents
    [HttpGet]
    public async Task<IActionResult> GetIncidents()
    {
        var incidents = await _incidentService.GetAllIncidentsWithFilesAsync();
        return Ok(incidents);
    }

    // Get a single incident
    [HttpGet("{id}")]
    public async Task<IActionResult> GetIncident(int id)
    {
        var incident = await _incidentService.GetIncidentAsync(id);
        if (incident == null)
            return NotFound();
        return Ok(incident);
    }

    // Update incident status
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateIncidentStatus(int id, [FromBody] StatusType status)
    {
        var updated = await _incidentService.UpdateIncidentStatusAsync(id, status);
        if (!updated)
            return NotFound();
        return Ok();
    }

    [HttpPost("createwithfiles")]
    public async Task<IActionResult> CreateIncidentWithFiles([FromForm] IncidentCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // File size validation (optional, can be improved for multiple files)
        if (dto.Files != null && dto.Files.Any(f => f.Length == 0))
            return BadRequest(new { HasError = true, ErrorDescription = "All files must be larger than 0 KB" });

        // Create the incident
        var incident = await _incidentService.CreateIncidentAsync(dto);

        
        // Handle file uploads
        List<IncidentFile> uploadedFiles = await _fileService.HandleFileUploads(dto, incident);

        //return CreatedAtAction(nameof(GetIncident), new { id = incident.IncidentId }, incident);
        return Ok();
    }

    
}
