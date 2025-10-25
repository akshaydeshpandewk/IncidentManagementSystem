import { useState, useEffect } from 'react'
import IncidentGrid from './components/IncidentGrid'
import CertificateHelper from './components/CertificateHelper'
import BackendStatus from './components/BackendStatus'
import Toast from './components/Toast'
import CreateIncidentModal from './components/CreateIncidentModal'
import { IncidentApiService } from './services/incidentApi'
import { sampleIncidentData } from './data/sampleIncidentData'
import type { IncidentWithFilesDto, IncidentGridColumn, IncidentCreateDto } from './types/IncidentTypes'
import { StatusType } from './types/IncidentTypes'
import './App.css'

const columns: IncidentGridColumn[] = [
  { key: 'incidentId', header: 'ID', width: '80px' },
  { key: 'title', header: 'Title', width: '200px' },
  { key: 'description', header: 'Description', width: '300px' },
  { key: 'severity', header: 'Severity', width: '120px' },
  { key: 'status', header: 'Status', width: '120px' },
  { key: 'createdAt', header: 'Created', width: '180px' },
  { key: 'updatedAt', header: 'Updated', width: '180px' },
  { key: 'filesCount', header: 'Files', width: '80px' },
  { key: 'actions', header: 'Actions', width: '120px' },
]

function App() {
  const [incidents, setIncidents] = useState<IncidentWithFilesDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useDemoData, setUseDemoData] = useState(false)
  const [showCertificateHelper, setShowCertificateHelper] = useState(false)
  const [updatingIncidents, setUpdatingIncidents] = useState<Set<number>>(new Set())
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creatingIncident, setCreatingIncident] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; visible: boolean }>({
    message: '',
    type: 'info',
    visible: false
  })

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, visible: true })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }))
  }

  useEffect(() => {
    const fetchIncidents = async () => {
      if (useDemoData) {
        // Use sample data for demo
        setLoading(true)
        setTimeout(() => {
          setIncidents(sampleIncidentData)
          setLoading(false)
          setError(null)
        }, 1000) // Simulate loading delay
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await IncidentApiService.getAllIncidents()
        setIncidents(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch incidents'
        console.error('Failed to fetch incidents:', err)
        
        // Check for certificate-related errors
        if (errorMessage.includes('SSL Certificate') || 
            errorMessage.includes('certificate') ||
            errorMessage.includes('ERR_CERT_AUTHORITY_INVALID')) {
          setError(errorMessage)
          setShowCertificateHelper(true)
          return
        }
        
        // Auto-fallback to demo data for connection failures
        if (errorMessage.includes('Failed to fetch') || 
            errorMessage.includes('Connection failed') ||
            errorMessage.includes('Network error') || 
            errorMessage.includes('Unable to connect') ||
            errorMessage.includes('Backend server is not running')) {
          console.log('Backend server not accessible, automatically switching to demo data')
          setUseDemoData(true)
          setIncidents(sampleIncidentData)
          setError('Backend server not running - automatically switched to demo data')
          return
        }
        
        // For other errors, just set the error message
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchIncidents()
  }, [useDemoData])

  const handleRefresh = async () => {
    if (useDemoData) {
      // Refresh demo data
      setLoading(true)
      setTimeout(() => {
        setIncidents(sampleIncidentData)
        setLoading(false)
        setError('Backend server not running - using demo data')
      }, 500)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await IncidentApiService.getAllIncidents()
      setIncidents(data)
      setError(null) // Clear any previous errors on success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch incidents'
      console.error('Refresh failed:', err)
      
      // Auto-switch to demo data if backend is not accessible
      if (errorMessage.includes('Failed to fetch') || 
          errorMessage.includes('Connection failed') ||
          errorMessage.includes('Backend server is not running')) {
        console.log('Backend still not accessible, switching to demo data')
        setUseDemoData(true)
        setIncidents(sampleIncidentData)
        setError('Backend server not running - switched to demo data')
      } else {
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleDemoMode = () => {
    setUseDemoData(!useDemoData)
    setShowCertificateHelper(false) // Hide certificate helper when switching modes
  }

  const handleTryReconnect = () => {
    setUseDemoData(false)
    setError(null)
    handleRefresh()
  }

  const handleCertificateRetry = () => {
    setShowCertificateHelper(false)
    setUseDemoData(false)
    setError(null)
    // Trigger a refresh
    handleRefresh()
  }

  const handleUseDemoFromCertificate = () => {
    setShowCertificateHelper(false)
    setUseDemoData(true)
    setError(null)
  }

  const handleUpdateIncidentStatus = async (incidentId: number, newStatus: StatusType) => {
    if (useDemoData) {
      // Update demo data optimistically
      setIncidents(prevIncidents => 
        prevIncidents.map(incident => 
          incident.incidentId === incidentId 
            ? { ...incident, status: newStatus, updatedAt: new Date().toISOString() }
            : incident
        )
      )
      showToast('Status updated successfully (demo mode)', 'success')
      return
    }

    // Track which incidents are being updated
    setUpdatingIncidents(prev => new Set(prev).add(incidentId))

    try {
      // Optimistically update the UI
      setIncidents(prevIncidents => 
        prevIncidents.map(incident => 
          incident.incidentId === incidentId 
            ? { ...incident, status: newStatus, updatedAt: new Date().toISOString() }
            : incident
        )
      )

      // Call the API to update the incident status
      await IncidentApiService.updateIncidentStatus(incidentId, newStatus)
      
      showToast(`Incident #${incidentId} status updated successfully`, 'success')
      
    } catch (error) {
      // Revert the optimistic update on error
      console.error('Failed to update incident status:', error)
      showToast(`Failed to update incident #${incidentId} status`, 'error')
      
      // Refresh the data to ensure consistency
      if (!useDemoData) {
        try {
          const refreshedData = await IncidentApiService.getAllIncidents()
          setIncidents(refreshedData)
        } catch (refreshError) {
          console.error('Failed to refresh data after update error:', refreshError)
          setError('Failed to update incident status. Please refresh the page.')
        }
      }
    } finally {
      // Remove from updating set
      setUpdatingIncidents(prev => {
        const newSet = new Set(prev)
        newSet.delete(incidentId)
        return newSet
      })
    }
  }

  const handleCreateIncident = async (incident: IncidentCreateDto) => {
    if (useDemoData) {
      // For demo mode, simulate creating an incident
      const newIncident: IncidentWithFilesDto = {
        incidentId: Date.now(), // Simple ID generation for demo
        title: incident.title,
        description: incident.description,
        severity: incident.severity,
        status: StatusType.New, // Default to New status for new incidents
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        files: incident.files?.map((file, index) => ({
          incidentFileId: index + 1,
          fileName: file.name,
          filePath: `/uploads/${file.name}`,
          uploadedAt: new Date().toISOString()
        })) || []
      }
      
      setIncidents(prev => [newIncident, ...prev])
      showToast('Incident created successfully (demo mode)', 'success')
      handleRefresh()
      return
    }

    setCreatingIncident(true)
    try {
      const newIncident = await IncidentApiService.createIncidentWithFiles(incident)
      setIncidents(prev => [newIncident, ...prev])
      showToast('Incident created successfully', 'success')
    } catch (error) {
      console.error('Failed to create incident:', error)
      showToast('Failed to create incident', 'error')
      throw error // Re-throw to let the modal handle it
    } finally {
      setCreatingIncident(false)
    }
  }

  return (
    <>
      <CreateIncidentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateIncident}
        isCreating={creatingIncident}
      />
      
      <div className={`app ${showCreateModal ? 'sidebar-open' : ''}`}>
        <div className="app-content">
          {showCertificateHelper && (
            <CertificateHelper
              onRetry={handleCertificateRetry}
              onUseDemoData={handleUseDemoFromCertificate}
            />
          )}
          
          <header className="app-header">
        <h1>Incident Management System</h1>
        <p>Track and manage incidents with detailed information and file attachments</p>
        <div className="header-actions">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="create-button"
            disabled={loading}
          >
            Create Incident
          </button>
          <button 
            onClick={toggleDemoMode}
            className={`demo-toggle ${useDemoData ? 'active' : ''}`}
          >
            {useDemoData ? 'Using Demo Data' : 'Use Demo Data'}
          </button>
          <button 
            onClick={handleRefresh} 
            className="refresh-button"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <span className="incident-count">
            {!loading && `Total: ${incidents.length} incidents`}
          </span>
        </div>
      </header>
      
      <BackendStatus 
        isUsingDemo={useDemoData}
        onTryReconnect={handleTryReconnect}
      />
      
      <main>
        <IncidentGrid 
          data={incidents} 
          columns={columns} 
          loading={loading}
          error={error || undefined}
          onUpdateStatus={handleUpdateIncidentStatus}
          updatingIncidents={updatingIncidents}
        />
      </main>
      
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={hideToast}
      />
        </div>
      </div>
    </>
  )
}

export default App
