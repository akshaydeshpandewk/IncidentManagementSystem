# Incident Management System API

A .NET 8 Web API for managing incidents with file upload capabilities, built with Entity Framework Core and SQL Server.

## Prerequisites

### Required Software
- **.NET 8 SDK** or later
  - Download from: https://dotnet.microsoft.com/download/dotnet/8.0
  - Verify installation: `dotnet --version`

- **SQL Server** (one of the following):
  - SQL Server Express (recommended for development)
  - SQL Server Developer Edition
  - SQL Server LocalDB
  - SQL Server running in Docker

- **Visual Studio 2022** or **Visual Studio Code** (recommended IDEs)
  - Visual Studio 2022: Community, Professional, or Enterprise
  - VS Code with C# Dev Kit extension

### System Requirements
- Windows 10/11, macOS 10.15+, or Linux (Ubuntu 18.04+)
- Minimum 4GB RAM (8GB recommended)
- 2GB available disk space

## Dependencies

This project uses the following NuGet packages:

- **Microsoft.EntityFrameworkCore** (9.0.10) - ORM for database operations
- **Microsoft.EntityFrameworkCore.SqlServer** (9.0.10) - SQL Server provider for EF Core
- **Swashbuckle.AspNetCore** (9.0.6) - Swagger/OpenAPI documentation

## Database Setup

### Option 1: SQL Server Express (Recommended)
1. Download and install SQL Server Express from Microsoft
2. During installation, note the instance name (usually `SQLEXPRESS`)
3. Update the connection string in `appsettings.json` if needed

### Option 2: SQL Server with Docker
```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Abcd#1234" -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2022-latest
```

### Option 3: SQL Server LocalDB
```bash
# Install LocalDB (usually comes with Visual Studio)
sqllocaldb create MSSQLLocalDB
sqllocaldb start MSSQLLocalDB
```

## Build Instructions

### 1. Clone and Navigate to Project
```bash
git clone <repository-url>
cd IncidentManagementSystemAPI
```

### 2. Restore Dependencies
```bash
dotnet restore
```

### 3. Update Database Connection
Edit `appsettings.json` and update the connection string to match your SQL Server setup:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=IncidentDB;User Id=sa;Password=Abcd#1234;TrustServerCertificate=True;"
  }
}
```

**Connection String Examples:**
- **SQL Server Express**: `Server=localhost\\SQLEXPRESS;Database=IncidentDB;Trusted_Connection=True;TrustServerCertificate=True;`
- **LocalDB**: `Server=(localdb)\\mssqllocaldb;Database=IncidentDB;Trusted_Connection=True;`
- **Docker/Remote**: `Server=localhost,1433;Database=IncidentDB;User Id=sa;Password=YourPassword;TrustServerCertificate=True;`

### 4. Create Database and Tables
```bash
# Add Entity Framework tools (if not already installed)
dotnet tool install --global dotnet-ef

# Create database migration
dotnet ef migrations add InitialCreate

# Update database
dotnet ef database update
```

### 5. Build the Project
```bash
dotnet build
```

## Deploy

### Development Deployment
The application is configured for local development by default.

### Production Deployment

#### Option 1: Self-Contained Deployment
```bash
# Publish for Windows
dotnet publish -c Release -r win-x64 --self-contained

# Publish for Linux
dotnet publish -c Release -r linux-x64 --self-contained
```

#### Option 2: Framework-Dependent Deployment
```bash
dotnet publish -c Release
```

#### Option 3: Docker Deployment
Create a `Dockerfile` in the project root:

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["IncidentManagementSystemAPI/IncidentManagementSystemAPI.csproj", "IncidentManagementSystemAPI/"]
RUN dotnet restore "IncidentManagementSystemAPI/IncidentManagementSystemAPI.csproj"
COPY . .
WORKDIR "/src/IncidentManagementSystemAPI"
RUN dotnet build "IncidentManagementSystemAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "IncidentManagementSystemAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "IncidentManagementSystemAPI.dll"]
```

Then build and run:
```bash
docker build -t incident-api .
docker run -p 8080:80 incident-api
```

## Run

### Development Mode
```bash
# Run with hot reload
dotnet run

# Or run with specific profile
dotnet run --launch-profile https
```

### Using Visual Studio
1. Open `IncidentManagementSystemAPI.sln`
2. Set `IncidentManagementSystemAPI` as startup project
3. Press F5 or click "Start Debugging"

### Using Visual Studio Code
1. Open the project folder
2. Press F5 or use the "Run and Debug" panel
3. Select ".NET Core Launch (web)" configuration

## Application URLs

After starting the application, it will be available at:

- **HTTP**: http://localhost:5203
- **HTTPS**: https://localhost:7186
- **Swagger UI**: http://localhost:5203/swagger (Development only)

## API Endpoints

### Incidents Controller
- `GET /api/incidents` - Get all incidents
- `GET /api/incidents/{id}` - Get incident by ID
- `POST /api/incidents` - Create new incident
- `PUT /api/incidents/{id}` - Update incident


### File Upload
The API supports file uploads with incidents. Files are stored in the `Uploads/{IncidentId}/` directory.

## Architecture & Design Decisions

### Application Architecture

The Incident Management System API follows a **layered architecture** pattern with clear separation of concerns:

#### **Presentation Layer**
- **Controllers**: RESTful API endpoints (`IncidentsController.cs`)
- **DTOs**: Data Transfer Objects for API communication (`IncidentCreateDto.cs`, `IncidentWithFilesDto.cs`)
- **HTTP Configuration**: Swagger documentation, CORS policies, and routing

#### **Business Logic Layer**
- **Services**: Core business logic implementation (`IncidentService.cs`, `FileService.cs`)
- **Service Interfaces**: Abstraction contracts (`IIncidentService.cs`)
- **Dependency Injection**: Loose coupling through IoC container

#### **Data Access Layer**
- **Entity Framework Core**: ORM for database operations
- **DbContext**: Database context management (`IncidentDbContext.cs`)
- **Models**: Domain entities (`Incident.cs`)

### Key Design Decisions

#### **1. Entity Framework Code First**
- **Why**: Enables database schema versioning through migrations
- **Benefit**: Better developer experience and database evolution management
- **Trade-off**: Requires migration management in production deployments

#### **2. Repository Pattern via EF Core**
- **Why**: EF Core DbContext already implements Unit of Work and Repository patterns
- **Benefit**: Simplified data access without additional abstraction layers
- **Decision**: Direct DbContext usage rather than custom repository implementation

#### **3. Service Layer Pattern**
- **Why**: Separation of business logic from controllers
- **Benefit**: Testability, reusability, and maintainability
- **Implementation**: Interface-based services with dependency injection

#### **4. File Storage Strategy**
- **Current**: Local file system storage in `Uploads/{IncidentId}/` directory
- **Why**: Simple implementation for development and small-scale deployments
- **Future Consideration**: Azure Blob Storage for production scalability

#### **5. CORS Configuration**
- **Current**: Allow all origins in development
- **Why**: Simplified local development and testing
- **Production**: Should be restricted to specific domains

## Azure Integration & Cloud Strategy

### Current Azure Readiness

The application is designed with Azure deployment in mind:

#### **Azure App Service Compatibility**
- **.NET 8 Runtime**: Fully supported on Azure App Service
- **Configuration**: Uses standard .NET configuration providers compatible with Azure
- **Health Checks**: Ready for Azure App Service health monitoring

#### **Azure SQL Database Ready**
- **Connection Strings**: Supports Azure SQL Database connection strings
- **Entity Framework**: Compatible with Azure SQL Database features
- **Security**: Supports Azure AD authentication (can be configured)

### Recommended Azure Architecture

For production deployment, consider this Azure architecture:

#### **Compute Layer**
- **Azure App Service**: Host the Web API
  - Built-in scaling and load balancing
  - Deployment slots for blue-green deployments
  - Integrated with Azure DevOps for CI/CD

#### **Data Layer**
- **Azure SQL Database**: Managed database service
  - Automatic backups and point-in-time recovery
  - Built-in high availability
  - Advanced security features (TDE, Always Encrypted)

#### **Storage Layer**
- **Azure Blob Storage**: File upload storage
  - Scalable and cost-effective
  - Built-in CDN integration
  - Lifecycle management policies

#### **Monitoring & Security**
- **Application Insights**: Application performance monitoring
- **Azure Key Vault**: Secure configuration and connection string management
- **Azure Active Directory**: Authentication and authorization

### Azure Migration Path

#### **Phase 1: Lift and Shift**
```bash
# Deploy to Azure App Service
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name incident-api

# Configure connection string
az webapp config connection-string set --resource-group myResourceGroup --name incident-api --settings DefaultConnection="Server=myserver.database.windows.net;Database=IncidentDB;..."
```

#### **Phase 2: Cloud-Native Features**
1. **Azure Blob Storage Integration**
   ```csharp
   // Replace FileService with Azure Blob Storage
   services.AddScoped<IFileService, AzureBlobFileService>();
   ```

2. **Application Insights Integration**
   ```csharp
   // Add to Program.cs
   builder.Services.AddApplicationInsightsTelemetry();
   ```

3. **Azure Key Vault Configuration**
   ```csharp
   // Add Key Vault configuration provider
   builder.Configuration.AddAzureKeyVault(keyVaultEndpoint, new DefaultAzureCredential());
   ```

#### **Phase 3: Advanced Azure Services**
- **Azure Service Bus**: Event-driven architecture for incident notifications
- **Azure Functions**: Background processing for file analysis
- **Azure API Management**: API gateway and throttling
- **Azure Front Door**: Global load balancing and CDN

### Infrastructure as Code

#### **Bicep Template Example**
```bicep
// Azure resources for Incident Management API
resource appServicePlan 'Microsoft.Web/serverfarms@2021-02-01' = {
  name: 'incident-api-plan'
  location: location
  sku: {
    name: 'B1'
    tier: 'Basic'
  }
}

resource webApp 'Microsoft.Web/sites@2021-02-01' = {
  name: 'incident-management-api'
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      netFrameworkVersion: 'v8.0'
      metadata: [
        {
          name: 'CURRENT_STACK'
          value: 'dotnet'
        }
      ]
    }
  }
}
```

### Cost Optimization

#### **Development Environment**
- **Azure App Service**: Basic tier (B1) ~$13/month
- **Azure SQL Database**: Basic tier (5 DTU) ~$5/month
- **Azure Blob Storage**: Standard LRS ~$0.02/GB/month

#### **Production Environment**
- **Azure App Service**: Standard tier (S1) with auto-scaling
- **Azure SQL Database**: Standard tier (S2) with geo-replication
- **Azure Blob Storage**: Standard with lifecycle management

### Security Considerations

#### **Current Implementation**
- Basic authentication (can be extended)
- HTTPS redirection
- CORS configuration
- SQL injection protection via EF Core

#### **Azure Security Enhancements**
- **Azure AD Integration**: OAuth 2.0/OpenID Connect
- **Managed Identity**: Secure access to Azure resources
- **Web Application Firewall**: Protection against common attacks
- **Private Endpoints**: Network isolation for database access

## Configuration

### Environment Variables
You can override settings using environment variables:

```bash
# Connection string
export ConnectionStrings__DefaultConnection="your-connection-string"

# File size limit (in bytes)
export AllowedFileSizeInBytes=104857600  # 100MB
```

### appsettings.json
Key configuration settings:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "your-database-connection-string"
  },
  "AllowedFileSizeInBytes": 100,
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify SQL Server is running
   - Check connection string format
   - Ensure database exists and is accessible

2. **File Upload Issues**
   - Check disk space in `Uploads` directory
   - Verify file size limits in configuration
   - Ensure proper permissions on upload directory

3. **Port Conflicts**
   - Change ports in `launchSettings.json` if 5203/7186 are in use
   - Use `netstat -an | findstr :5203` to check port usage

4. **CORS Issues**
   - The API is configured to allow all origins in development
   - Update CORS policy in `Program.cs` for production

### Logs
- Application logs are written to console by default
- For file logging, configure additional providers in `Program.cs`

## Development Notes

- The project uses Entity Framework Code First approach
- File uploads are stored locally in the `Uploads` folder
- Swagger documentation is available in development mode
- CORS is configured to allow all origins (update for production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

[Add your license information here]