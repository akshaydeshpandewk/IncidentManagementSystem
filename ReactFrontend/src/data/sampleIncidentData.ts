import type { IncidentWithFilesDto } from '../types/IncidentTypes';
import { SeverityLevel, StatusType } from '../types/IncidentTypes';

export const sampleIncidentData: IncidentWithFilesDto[] = [
  {
    incidentId: 1,
    title: 'Database Connection Timeout',
    description: 'Users experiencing slow response times when accessing the customer database. Connection timeouts occurring frequently during peak hours.',
    severity: SeverityLevel.High,
    status: StatusType.InProgress,
    createdAt: '2024-10-20T08:30:00Z',
    updatedAt: '2024-10-25T14:22:00Z',
    files: [
      {
        incidentFileId: 1,
        fileName: 'error_logs.txt',
        filePath: '/uploads/incidents/1/error_logs.txt',
        uploadedAt: '2024-10-20T09:15:00Z'
      },
      {
        incidentFileId: 2,
        fileName: 'performance_metrics.pdf',
        filePath: '/uploads/incidents/1/performance_metrics.pdf',
        uploadedAt: '2024-10-22T16:45:00Z'
      }
    ]
  },
  {
    incidentId: 2,
    title: 'Login System Failure',
    description: 'Complete authentication system outage preventing all users from accessing the application.',
    severity: SeverityLevel.Critical,
    status: StatusType.New,
    createdAt: '2024-10-25T06:45:00Z',
    updatedAt: '2024-10-25T07:15:00Z',
    files: [
      {
        incidentFileId: 3,
        fileName: 'auth_server_logs.txt',
        filePath: '/uploads/incidents/2/auth_server_logs.txt',
        uploadedAt: '2024-10-25T07:00:00Z'
      }
    ]
  },
  {
    incidentId: 3,
    title: 'Email Notification Delay',
    description: 'Email notifications are being sent with significant delays, affecting user experience.',
    severity: SeverityLevel.Medium,
    status: StatusType.Resolved,
    createdAt: '2024-10-18T14:20:00Z',
    updatedAt: '2024-10-24T11:30:00Z',
    files: []
  },
  {
    incidentId: 4,
    title: 'Mobile App Crash on iOS',
    description: 'iOS users reporting app crashes when trying to upload images. Seems to be related to memory management.',
    severity: SeverityLevel.High,
    status: StatusType.InProgress,
    createdAt: '2024-10-23T10:15:00Z',
    updatedAt: '2024-10-25T13:45:00Z',
    files: [
      {
        incidentFileId: 4,
        fileName: 'crash_reports.zip',
        filePath: '/uploads/incidents/4/crash_reports.zip',
        uploadedAt: '2024-10-23T11:30:00Z'
      },
      {
        incidentFileId: 5,
        fileName: 'device_specs.json',
        filePath: '/uploads/incidents/4/device_specs.json',
        uploadedAt: '2024-10-23T12:00:00Z'
      },
      {
        incidentFileId: 6,
        fileName: 'memory_analysis.txt',
        filePath: '/uploads/incidents/4/memory_analysis.txt',
        uploadedAt: '2024-10-24T09:20:00Z'
      }
    ]
  },
  {
    incidentId: 5,
    title: 'UI Button Misalignment',
    description: 'Submit button appears misaligned on the checkout page in certain browser configurations.',
    severity: SeverityLevel.Low,
    status: StatusType.Resolved,
    createdAt: '2024-10-15T16:30:00Z',
    updatedAt: '2024-10-16T09:45:00Z',
    files: [
      {
        incidentFileId: 7,
        fileName: 'screenshot_chrome.png',
        filePath: '/uploads/incidents/5/screenshot_chrome.png',
        uploadedAt: '2024-10-15T16:45:00Z'
      },
      {
        incidentFileId: 8,
        fileName: 'screenshot_firefox.png',
        filePath: '/uploads/incidents/5/screenshot_firefox.png',
        uploadedAt: '2024-10-15T17:00:00Z'
      }
    ]
  }
];