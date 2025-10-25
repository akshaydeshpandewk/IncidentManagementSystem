import React, { useState } from 'react';
import type { IncidentWithFilesDto, IncidentGridColumn, SeverityLevel, StatusType } from '../types/IncidentTypes';
import { formatSeverity, formatStatus, formatDateTime } from '../types/IncidentTypes';
import StatusUpdateModal from './StatusUpdateModal';
import './IncidentGrid.css';

interface IncidentGridProps {
  data: IncidentWithFilesDto[];
  columns: IncidentGridColumn[];
  loading?: boolean;
  error?: string;
  onUpdateStatus?: (incidentId: number, newStatus: StatusType) => void;
  updatingIncidents?: Set<number>;
}

const IncidentGrid: React.FC<IncidentGridProps> = ({ 
  data, 
  columns, 
  loading, 
  error, 
  onUpdateStatus,
  updatingIncidents = new Set()
}) => {
  const [selectedIncident, setSelectedIncident] = useState<IncidentWithFilesDto | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const handleStatusUpdateClick = (incident: IncidentWithFilesDto) => {
    setSelectedIncident(incident);
    setShowStatusModal(true);
  };

  const handleCloseModal = () => {
    setShowStatusModal(false);
    setSelectedIncident(null);
  };

  const handleStatusUpdate = (incidentId: number, newStatus: StatusType) => {
    if (onUpdateStatus) {
      onUpdateStatus(incidentId, newStatus);
    }
  };
  const getCellValue = (incident: IncidentWithFilesDto, column: IncidentGridColumn): string | React.ReactNode => {
    if (column.key === 'filesCount') {
      return (incident.files?.length || 0).toString();
    }

    if (column.key === 'actions') {
      const isUpdating = updatingIncidents.has(incident.incidentId);
      return (
        <button
          className={`update-status-btn ${isUpdating ? 'updating' : ''}`}
          onClick={() => handleStatusUpdateClick(incident)}
          disabled={isUpdating || !onUpdateStatus}
          title="Update Status"
        >
          {isUpdating ? '⏳' : '✏️'}
        </button>
      );
    }

    const value = incident[column.key as keyof IncidentWithFilesDto];

    if (column.formatter) {
      return column.formatter(value);
    }

    if (column.key === 'severity') {
      return formatSeverity(value as SeverityLevel);
    }

    if (column.key === 'status') {
      return formatStatus(value as StatusType);
    }

    if (column.key === 'createdAt' || column.key === 'updatedAt') {
      return formatDateTime(value as string);
    }

    return String(value);
  };

  if (loading) {
    return (
      <div className="incident-grid-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading incidents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="incident-grid-container">
        <div className="error-state">
          <p className="error-message">Error: {error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="incident-grid-container">
        <div className="empty-state">
          <p>No incidents found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="incident-grid-container">
      <table className="incident-grid-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th 
                key={column.key} 
                className="incident-grid-header"
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.filter(incident => incident && incident.incidentId).map((incident) => (
            <tr key={incident.incidentId} className="incident-grid-row">
              {columns.map((column) => (
                <td key={column.key} className="incident-grid-cell">
                  {getCellValue(incident, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {selectedIncident && (
        <StatusUpdateModal
          incident={selectedIncident}
          isOpen={showStatusModal}
          onClose={handleCloseModal}
          onUpdateStatus={handleStatusUpdate}
          isUpdating={updatingIncidents.has(selectedIncident.incidentId)}
        />
      )}
    </div>
  );
};

export default IncidentGrid;