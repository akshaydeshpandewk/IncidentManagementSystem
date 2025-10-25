import React from 'react';
import type { StatusType, IncidentWithFilesDto } from '../types/IncidentTypes';
import { StatusType as StatusTypeEnum, formatStatus } from '../types/IncidentTypes';
import './StatusUpdateModal.css';

interface StatusUpdateModalProps {
  incident: IncidentWithFilesDto;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (incidentId: number, newStatus: StatusType) => void;
  isUpdating?: boolean;
}

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  incident,
  isOpen,
  onClose,
  onUpdateStatus,
  isUpdating = false,
}) => {
  if (!isOpen) return null;

  const statusOptions = [
    { value: StatusTypeEnum.New, label: 'New', color: '#17a2b8' },
    { value: StatusTypeEnum.InProgress, label: 'In Progress', color: '#ffc107' },
    { value: StatusTypeEnum.Resolved, label: 'Resolved', color: '#28a745' },
  ];

  const handleStatusUpdate = (newStatus: StatusType) => {
    onUpdateStatus(incident.incidentId, newStatus);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="status-update-modal-backdrop" onClick={handleBackdropClick}>
      <div className="status-update-modal">
        <div className="modal-header">
          <h3>Update Status</h3>
          <button onClick={onClose} className="close-button" disabled={isUpdating}>
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <div className="incident-info">
            <h4>Incident #{incident.incidentId}</h4>
            <p className="incident-title">{incident.title}</p>
            <p className="current-status">
              Current Status: <span className="status-badge">{formatStatus(incident.status)}</span>
            </p>
          </div>
          
          <div className="status-options">
            <h5>Select New Status:</h5>
            <div className="status-buttons">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  className={`status-button ${incident.status === option.value ? 'current' : ''}`}
                  style={{ borderColor: option.color, color: option.color }}
                  onClick={() => handleStatusUpdate(option.value)}
                  disabled={isUpdating || incident.status === option.value}
                >
                  {option.label}
                  {incident.status === option.value && ' (Current)'}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            onClick={onClose} 
            className="cancel-button"
            disabled={isUpdating}
          >
            Cancel
          </button>
        </div>
        
        {isUpdating && (
          <div className="updating-overlay">
            <div className="updating-spinner"></div>
            <p>Updating status...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusUpdateModal;