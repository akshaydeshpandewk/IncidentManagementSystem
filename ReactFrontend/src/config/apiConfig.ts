// API Configuration
export const API_CONFIG = {
  // Try HTTP first, fallback to HTTPS if needed
  baseUrl: 'http://localhost:7186',
  httpsBaseUrl: 'https://localhost:7186',
  endpoints: {
    incidents: '/api/Incidents',
    incident: (id: number) => `/api/Incidents/${id}`,
    incidentStatus: (id: number) => `/api/Incidents/${id}/status`,
    createIncidentWithFiles: '/api/Incidents/createwithfiles',
  },
  timeout: 10000, // 10 seconds
  retryAttempts: 3,
};

// Common API error types
export interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
}

export class ApiErrorHandler {
  static createError(response: Response, defaultMessage: string): ApiError {
    return {
      message: `${defaultMessage} (${response.status}: ${response.statusText})`,
      status: response.status,
      statusText: response.statusText,
    };
  }

  static handleNetworkError(error: unknown): ApiError {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return {
        message: 'Connection failed: Backend server is not running or not accessible. Please ensure your API server is running on localhost:7186 (HTTP) or localhost:7186 (HTTPS).',
      };
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        message: 'Network error: Unable to connect to the API. Please ensure the backend server is running and accessible.',
      };
    }
    
    if (error instanceof Error) {
      // Handle certificate errors specifically
      if (error.message.includes('ERR_CERT_AUTHORITY_INVALID') || 
          error.message.includes('certificate') ||
          error.message.includes('SSL') ||
          error.message.includes('TLS')) {
        return {
          message: 'SSL Certificate error: Please visit https://localhost:7186 in your browser and accept the certificate, then try again.',
        };
      }
      
      return {
        message: `API Error: ${error.message}`,
      };
    }
    
    return {
      message: 'Unknown error occurred while connecting to the API',
    };
  }
}