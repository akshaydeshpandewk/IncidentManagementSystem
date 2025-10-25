import React from 'react';
import './CertificateHelper.css';

interface CertificateHelperProps {
  onRetry: () => void;
  onUseDemoData: () => void;
}

const CertificateHelper: React.FC<CertificateHelperProps> = ({ onRetry, onUseDemoData }) => {
  const handleOpenApiUrl = () => {
    window.open('https://localhost:7186', '_blank');
  };

  return (
    <div className="certificate-helper">
      <div className="certificate-helper-content">
        <h3>🔒 SSL Certificate Issue</h3>
        <p>
          The API server is using a self-signed certificate that your browser doesn't trust.
        </p>
        
        <div className="certificate-steps">
          <h4>To fix this issue:</h4>
          <ol>
            <li>
              <button onClick={handleOpenApiUrl} className="api-link-button">
                Click here to open the API URL
              </button>
            </li>
            <li>Accept the certificate warning in your browser</li>
            <li>Return to this page and click "Retry"</li>
          </ol>
        </div>

        <div className="certificate-actions">
          <button onClick={onRetry} className="retry-button">
            Retry Connection
          </button>
          <button onClick={onUseDemoData} className="demo-button">
            Use Demo Data Instead
          </button>
        </div>

        <div className="certificate-note">
          <p>
            <strong>Alternative:</strong> If your backend supports HTTP, 
            the app will automatically try HTTP connections first.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CertificateHelper;