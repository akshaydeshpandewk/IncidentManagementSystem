# Incident Management System - Setup Instructions

This document provides comprehensive instructions for building, deploying, and running the React-based Incident Management System.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Project Overview](#project-overview)
- [Backend Requirements](#backend-requirements)
- [Installation](#installation)
- [Development Setup](#development-setup)
- [Building the Application](#building-the-application)
- [Deployment](#deployment)
- [Running the Application](#running-the-application)
- [API Configuration](#api-configuration)
- [Troubleshooting](#troubleshooting)
- [Features](#features)

## 🔧 Prerequisites

Before setting up the application, ensure you have the following installed:

### Required Software
- **Node.js** (version 18.0 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
- **npm** (comes with Node.js)
  - Verify installation: `npm --version`
- **Git** (optional, for version control)

### System Requirements
- **Operating System**: Windows 10/11, macOS, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: At least 500MB free space

## 📁 Project Overview

This is a React-based Incident Management System built with:
- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.7
- **UI**: Custom CSS with responsive design
- **State Management**: React Hooks
- **API Communication**: Fetch API with error handling

### Key Features
- ✅ Incident listing with grid view
- ✅ Create new incidents with file uploads
- ✅ Update incident status
- ✅ Dual HTTP/HTTPS API support
- ✅ Demo mode with sample data
- ✅ SSL certificate error handling
- ✅ Responsive sidebar layout
- ✅ Toast notifications
- ✅ Error boundaries and validation

## 🖥️ Backend Requirements

The application requires a C# backend API running on:
- **HTTP**: `http://localhost:7186`
- **HTTPS**: `https://localhost:7186`

### Required API Endpoints
1. **GET** `/api/Incidents` - List all incidents
2. **GET** `/api/Incidents/{id}` - Get specific incident
3. **PUT** `/api/Incidents/{id}/status` - Update incident status
4. **POST** `/api/Incidents/createwithfiles` - Create incident with files
5. **DELETE** `/api/Incidents/{id}` - Delete incident

### Backend Model Requirements
```csharp
public class IncidentCreateDto
{
    public string Title { get; set; }
    public string Description { get; set; }
    public SeverityLevel Severity { get; set; }
    public int FileSize { get; set; }
    public List<IFormFile> Files { get; set; }
}
```

## 🚀 Installation

### 1. Clone or Download the Project
```bash
# If using Git
git clone <repository-url>
cd ReactFrontend

# Or download and extract the project files
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages including:
- React 19.1.1
- TypeScript 5.9.3
- Vite 7.1.7
- ESLint for code quality

## 🛠️ Development Setup

### 1. Start Development Server
```bash
npm run dev
```

This will:
- Start the Vite development server
- Open your browser to `http://localhost:5174`
- Enable hot module replacement (HMR)
- Provide real-time updates during development

### 2. Development Features
- **Hot Reload**: Changes reflect immediately
- **TypeScript Support**: Full type checking
- **ESLint Integration**: Code quality checks
- **Source Maps**: Debug-friendly

### 3. Available Scripts
```bash
# Development server
npm run dev

# Type checking and build
npm run build

# Code linting
npm run lint

# Preview production build
npm run preview
```

## 🏗️ Building the Application

### 1. Production Build
```bash
npm run build
```

This command will:
- Run TypeScript compilation (`tsc -b`)
- Bundle the application with Vite
- Optimize for production (minification, tree-shaking)
- Generate files in the `dist/` directory

### 2. Build Output
After building, you'll find:
```
dist/
├── index.html          # Main HTML file
├── assets/
│   ├── index-[hash].js  # Bundled JavaScript
│   └── index-[hash].css # Bundled CSS
└── [other assets]
```

### 3. Preview Production Build
```bash
npm run preview
```
- Serves the production build locally
- Available at `http://localhost:4173`

## 🌐 Deployment

### Option 1: Static Web Server
The application is a static SPA (Single Page Application) that can be deployed to any web server:

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder** to your web server:
   - **Azure Static Web Apps**
   - **Netlify**
   - **Vercel**
   - **GitHub Pages**
   - **AWS S3 + CloudFront**
   - **IIS** (Windows)
   - **Apache/Nginx** (Linux)

### Option 2: Azure Static Web Apps
```bash
# Install Azure CLI (if not already installed)
npm install -g @azure/static-web-apps-cli

# Deploy to Azure
swa deploy
```

### Option 3: Docker Deployment
Create a `Dockerfile`:
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t incident-management .
docker run -p 80:80 incident-management
```

## ▶️ Running the Application

### 1. Start Backend API
Before running the frontend, ensure your C# backend is running on:
- `http://localhost:7186` or `https://localhost:7186`

### 2. Start Frontend Application

#### Development Mode
```bash
npm run dev
```
- URL: `http://localhost:5174`
- Features: Hot reload, debugging

#### Production Mode
```bash
npm run build
npm run preview
```
- URL: `http://localhost:4173`
- Features: Optimized build

### 3. Application Modes

#### Live API Mode
- Connects to backend API
- Real-time data operations
- Full CRUD functionality

#### Demo Mode
- Uses sample data
- No backend required
- Toggle with "Use Demo Data" button

## ⚙️ API Configuration

### Default Configuration
The application is configured to connect to:
```typescript
baseUrl: 'http://localhost:7186'
httpsBaseUrl: 'https://localhost:7186'
```

### Customizing API Endpoints
Edit `src/config/apiConfig.ts`:
```typescript
export const API_CONFIG = {
  baseUrl: 'http://your-api-server:port',
  httpsBaseUrl: 'https://your-api-server:port',
  // ... other configurations
};
```

### Environment-Specific Configuration
For different environments, you can use Vite environment variables:

1. Create `.env.development`:
   ```env
   VITE_API_BASE_URL=http://localhost:7186
   ```

2. Create `.env.production`:
   ```env
   VITE_API_BASE_URL=https://your-production-api.com
   ```

3. Update `apiConfig.ts`:
   ```typescript
   baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:7186'
   ```

## 🔧 Troubleshooting

### Common Issues

#### 1. "Failed to fetch" Errors
**Problem**: API connection issues
**Solutions**:
- Ensure backend server is running
- Check API URL configuration
- Use "Demo Mode" for testing without backend
- Verify CORS settings on backend

#### 2. SSL Certificate Errors
**Problem**: HTTPS certificate not trusted
**Solutions**:
- Visit `https://localhost:7186` in browser and accept certificate
- Use HTTP endpoint instead
- Application automatically falls back to HTTP

#### 3. Build Failures
**Problem**: TypeScript or build errors
**Solutions**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run lint

# Update dependencies
npm update
```

#### 4. Port Already in Use
**Problem**: Development server won't start
**Solutions**:
```bash
# Use different port
npm run dev -- --port 3000

# Or kill process using port 5174
# Windows
netstat -ano | findstr :5174
taskkill /PID [PID] /F

# Linux/Mac
lsof -ti:5174 | xargs kill
```

### Debug Mode
Enable verbose logging by adding to `src/main.tsx`:
```typescript
if (import.meta.env.DEV) {
  console.log('Development mode enabled');
}
```

### Browser Developer Tools
- **F12**: Open developer tools
- **Console**: View application logs
- **Network**: Monitor API calls
- **Application**: Check local storage

## 📊 Performance Optimization

### Production Optimizations
- **Code Splitting**: Automatic with Vite
- **Tree Shaking**: Dead code elimination
- **Minification**: JavaScript and CSS
- **Gzip Compression**: Enable on server

### Bundle Analysis
```bash
npm run build -- --analyze
```

## 🔐 Security Considerations

### Content Security Policy (CSP)
Add to your server configuration:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self'; 
               style-src 'self' 'unsafe-inline';">
```

### API Security
- Use HTTPS in production
- Implement proper authentication
- Validate file uploads on backend
- Set file size limits

## 📝 Additional Information

### File Structure
```
src/
├── components/          # React components
│   ├── CreateIncidentModal.tsx
│   ├── IncidentGrid.tsx
│   └── ...
├── config/             # Configuration files
│   └── apiConfig.ts
├── data/               # Sample data
├── services/           # API services
├── types/              # TypeScript types
└── assets/             # Static assets
```

### Browser Support
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Contributing
1. Fork the repository
2. Create feature branch
3. Run tests: `npm run lint`
4. Commit changes
5. Submit pull request

---

## 🆘 Support

If you encounter issues:
1. Check this documentation
2. Review browser console for errors
3. Verify backend API is running
4. Try demo mode for frontend-only testing
5. Check network connectivity

For additional help, contact the development team or create an issue in the project repository.