// Enums matching the C# enums
export const SeverityLevel = {
  Low: 0,
  Medium: 1,
  High: 2,
  Critical: 3
} as const;

export type SeverityLevel = typeof SeverityLevel[keyof typeof SeverityLevel];

export const StatusType = {
  New: 0,
  InProgress: 1,
  Resolved: 2
} as const;

export type StatusType = typeof StatusType[keyof typeof StatusType];

// Interface for IncidentFileDto
export interface IncidentFileDto {
  incidentFileId: number;
  fileName: string;
  filePath: string;
  uploadedAt: string; // ISO date string
}

// Interface for IncidentWithFilesDto
export interface IncidentWithFilesDto {
  incidentId: number;
  title: string;
  description: string;
  severity: SeverityLevel;
  status: StatusType;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  files?: IncidentFileDto[]; // Make optional to handle cases where API might not return files
}

// Interface for IncidentCreateDto (for form data)
export interface IncidentCreateDto {
  title: string;
  description: string;
  severity: SeverityLevel;
  fileSize: number;
  files?: File[]; // For file uploads
}

// Grid column interface for incidents
export interface IncidentGridColumn {
  key: keyof IncidentWithFilesDto | 'filesCount' | 'actions';
  header: string;
  width?: string;
  formatter?: (value: unknown) => string;
}

// Helper functions for formatting
export const formatSeverity = (severity: SeverityLevel): string => {
  const severityNames = {
    [SeverityLevel.Low]: 'Low',
    [SeverityLevel.Medium]: 'Medium',
    [SeverityLevel.High]: 'High',
    [SeverityLevel.Critical]: 'Critical'
  };
  return severityNames[severity] || 'Unknown';
};

export const formatStatus = (status: StatusType): string => {
  const statusNames = {
    [StatusType.New]: 'New',
    [StatusType.InProgress]: 'In Progress',
    [StatusType.Resolved]: 'Resolved'
  };
  return statusNames[status] || 'Unknown';
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};