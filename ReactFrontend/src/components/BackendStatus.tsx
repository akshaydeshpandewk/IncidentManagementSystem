import React from 'react';

interface BackendStatusProps {
  isUsingDemo: boolean;
  onTryReconnect: () => void;
}

const BackendStatus: React.FC<BackendStatusProps> = ({ isUsingDemo, onTryReconnect }) => {
  if (!isUsingDemo) return null;

  return (
    <div className="backend-status">
      <div className="status-content">
        <span className="status-icon">⚠️</span>
        <div className="status-text">
          <strong>Backend Not Connected</strong>
          <p>The application is using demo data. Start your backend server to see live data.</p>
        </div>
        <div className="status-actions">
          <button onClick={onTryReconnect} className="reconnect-btn">
            Try Reconnect
          </button>
        </div>
      </div>
      
      <div className="backend-instructions">
        <details>
          <summary>How to start your backend server</summary>
          <div className="instructions-content">
            <p>Make sure your .NET API is running on one of these URLs:</p>
            <ul>
              <li><code>http://localhost:7186</code></li>
              <li><code>https://localhost:7186</code></li>
            </ul>
            <p>Common commands to start your API:</p>
            <pre><code>dotnet run
# or
dotnet watch run</code></pre>
          </div>
        </details>
      </div>
    </div>
  );
};

export default BackendStatus;