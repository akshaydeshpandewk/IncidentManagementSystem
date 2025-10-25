import { useState } from 'react'
import { SeverityLevel, formatSeverity } from '../types/IncidentTypes'
import type { IncidentCreateDto } from '../types/IncidentTypes'
import './CreateIncidentModal.css'

interface CreateIncidentModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (incident: IncidentCreateDto) => Promise<void>
  isCreating?: boolean
}

export default function CreateIncidentModal({ 
  isOpen, 
  onClose, 
  onCreate, 
  isCreating = false 
}: CreateIncidentModalProps) {
  const [formData, setFormData] = useState<IncidentCreateDto>({
    title: '',
    description: '',
    severity: SeverityLevel.Low,
    fileSize: 0,
    files: []
  })
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === 'severity') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) as SeverityLevel
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)
    
    setSelectedFiles(files)
    setFormData(prev => ({
      ...prev,
      files,
      fileSize: totalSize
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.description.trim()) {
      return
    }

    try {
      await onCreate(formData)
      handleClose()
    } catch (error) {
      console.error('Failed to create incident:', error)
    }
  }

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      severity: SeverityLevel.Low,
      fileSize: 0,
      files: []
    })
    setSelectedFiles([])
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className={`create-incident-modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Incident</h2>
          <button 
            className="modal-close-button" 
            onClick={handleClose}
            disabled={isCreating}
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="create-incident-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              disabled={isCreating}
              placeholder="Enter incident title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              disabled={isCreating}
              rows={4}
              placeholder="Enter detailed description of the incident"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="severity">Severity</label>
              <select
                id="severity"
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                disabled={isCreating}
              >
                <option value={SeverityLevel.Low}>{formatSeverity(SeverityLevel.Low)}</option>
                <option value={SeverityLevel.Medium}>{formatSeverity(SeverityLevel.Medium)}</option>
                <option value={SeverityLevel.High}>{formatSeverity(SeverityLevel.High)}</option>
                <option value={SeverityLevel.Critical}>{formatSeverity(SeverityLevel.Critical)}</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="files">Attachments</label>
            <input
              type="file"
              id="files"
              name="files"
              onChange={handleFileChange}
              multiple
              disabled={isCreating}
              accept="*/*"
            />
            {selectedFiles.length > 0 && (
              <div className="selected-files">
                <p>Selected files:</p>
                <ul>
                  {selectedFiles.map((file, index) => (
                    <li key={index}>
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={handleClose}
              disabled={isCreating}
              className="cancel-button"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isCreating || !formData.title.trim() || !formData.description.trim()}
              className="create-button"
            >
              {isCreating ? 'Creating...' : 'Create Incident'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}