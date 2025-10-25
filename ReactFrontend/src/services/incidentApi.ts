import type { IncidentWithFilesDto, IncidentCreateDto } from '../types/IncidentTypes';
import { API_CONFIG, ApiErrorHandler } from '../config/apiConfig';

export class IncidentApiService {
  private static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // Try HTTP first to avoid certificate issues
    let url = `${API_CONFIG.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Add timeout using AbortController
      signal: AbortSignal.timeout(API_CONFIG.timeout),
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });

      if (!response.ok) {
        throw ApiErrorHandler.createError(response, 'Request failed');
      }

      // Handle empty responses (like 204 No Content)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T;
      }

      // Only try to parse JSON if there's content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }

      // If not JSON content, return empty object
      return {} as T;
    } catch (error) {
      // If HTTP fails, try HTTPS (user might need to accept certificate)
      if (url.startsWith('http://')) {
        console.log('HTTP request failed, trying HTTPS...');
        url = `${API_CONFIG.httpsBaseUrl}${endpoint}`;
        
        try {
          const response = await fetch(url, { ...defaultOptions, ...options });

          if (!response.ok) {
            throw ApiErrorHandler.createError(response, 'Request failed');
          }

          // Handle empty responses (like 204 No Content)
          if (response.status === 204 || response.headers.get('content-length') === '0') {
            return {} as T;
          }

          // Only try to parse JSON if there's content
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            return response.json();
          }

          // If not JSON content, return empty object
          return {} as T;
        } catch (httpsError) {
          console.error('Both HTTP and HTTPS requests failed:', httpsError);
          throw ApiErrorHandler.handleNetworkError(httpsError);
        }
      }
      
      throw ApiErrorHandler.handleNetworkError(error);
    }
  }

  static async getAllIncidents(): Promise<IncidentWithFilesDto[]> {
    try {
      return await this.request<IncidentWithFilesDto[]>(API_CONFIG.endpoints.incidents);
    } catch (error) {
      console.error('Error fetching incidents:', error);
      throw error;
    }
  }

  static async getIncidentById(id: number): Promise<IncidentWithFilesDto> {
    try {
      return await this.request<IncidentWithFilesDto>(API_CONFIG.endpoints.incident(id));
    } catch (error) {
      console.error(`Error fetching incident ${id}:`, error);
      throw error;
    }
  }

  static async createIncident(incident: Omit<IncidentWithFilesDto, 'incidentId' | 'createdAt' | 'updatedAt'>): Promise<IncidentWithFilesDto> {
    try {
      return await this.request<IncidentWithFilesDto>(API_CONFIG.endpoints.incidents, {
        method: 'POST',
        body: JSON.stringify(incident),
      });
    } catch (error) {
      console.error('Error creating incident:', error);
      throw error;
    }
  }

  static async createIncidentWithFiles(incident: IncidentCreateDto): Promise<IncidentWithFilesDto> {
    try {
      // For multipart/form-data, we need a special request method
      return await this.requestFormData<IncidentWithFilesDto>(API_CONFIG.endpoints.createIncidentWithFiles, incident);
    } catch (error) {
      console.error('Error creating incident with files:', error);
      throw error;
    }
  }

  private static async requestFormData<T>(endpoint: string, data: IncidentCreateDto): Promise<T> {
    let url = `${API_CONFIG.baseUrl}${endpoint}`;
    
    // Create FormData
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('severity', data.severity.toString());
    formData.append('fileSize', data.fileSize.toString());
    
    // Add files if they exist
    if (data.files && data.files.length > 0) {
      data.files.forEach((file) => {
        formData.append('files', file);
      });
    }

    const defaultOptions: RequestInit = {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - let the browser set it with boundary
      signal: AbortSignal.timeout(API_CONFIG.timeout),
    };

    try {
      const response = await fetch(url, defaultOptions);

      if (!response.ok) {
        throw ApiErrorHandler.createError(response, 'Request failed');
      }

      // Handle empty responses (like 204 No Content)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T;
      }

      // Only try to parse JSON if there's content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }

      // If not JSON content, return empty object
      return {} as T;
    } catch (error) {
      // If HTTP fails, try HTTPS
      if (url.startsWith('http://')) {
        console.log('HTTP request failed, trying HTTPS...');
        url = `${API_CONFIG.httpsBaseUrl}${endpoint}`;
        
        try {
          const response = await fetch(url, defaultOptions);

          if (!response.ok) {
            throw ApiErrorHandler.createError(response, 'Request failed');
          }

          // Handle empty responses (like 204 No Content)
          if (response.status === 204 || response.headers.get('content-length') === '0') {
            return {} as T;
          }

          // Only try to parse JSON if there's content
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            return response.json();
          }

          // If not JSON content, return empty object
          return {} as T;
        } catch (httpsError) {
          console.error('Both HTTP and HTTPS requests failed:', httpsError);
          throw ApiErrorHandler.handleNetworkError(httpsError);
        }
      }
      
      throw ApiErrorHandler.handleNetworkError(error);
    }
  }

  static async updateIncident(id: number, incident: Partial<IncidentWithFilesDto>): Promise<IncidentWithFilesDto> {
    try {
      return await this.request<IncidentWithFilesDto>(API_CONFIG.endpoints.incident(id), {
        method: 'PATCH',
        body: JSON.stringify(incident),
      });
    } catch (error) {
      console.error(`Error updating incident ${id}:`, error);
      throw error;
    }
  }

  static async updateIncidentStatus(id: number, status: number): Promise<IncidentWithFilesDto> {
    try {
      return await this.request<IncidentWithFilesDto>(API_CONFIG.endpoints.incidentStatus(id), {
        method: 'PATCH',
        body: JSON.stringify(status),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
    } catch (error) {
      console.error(`Error updating incident ${id} status:`, error);
      throw error;
    }
  }

  static async deleteIncident(id: number): Promise<void> {
    try {
      await this.request<void>(API_CONFIG.endpoints.incident(id), {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Error deleting incident ${id}:`, error);
      throw error;
    }
  }
}