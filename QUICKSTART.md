# ProjectAtlas - Quick Start Guide

## Project Successfully Built! ✅

The ProjectAtlas backend application has been successfully compiled and packaged.

**Build Details:**
- JAR File: `target/project-atlas-1.0.0.jar` (44.3 MB)
- Framework: Spring Boot 3.1.5
- Java Version: 17
- Build Tool: Maven 3.9.6

## 🚀 Getting Started

### Prerequisites
- **MySQL 8.0+** - Database server
- **Java 17+** - Runtime environment
- **Maven 3.8+** - (Already installed for building)

### Step 1: Setup MySQL Database

#### Option A: Using MySQL CLI
```bash
# Connect to MySQL
mysql -u root -p

# Run these commands
CREATE DATABASE project_atlas;
USE project_atlas;

# Load schema
SOURCE src/main/resources/db/schema.sql;
SOURCE src/main/resources/db/seed-data.sql;
```

#### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Create new schema: `project_atlas`
3. Open schema script: `src/main/resources/db/schema.sql`
4. Execute all statements
5. Open seed data script: `src/main/resources/db/seed-data.sql`
6. Execute all statements

### Step 2: Configure Database Credentials

Edit `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/project_atlas
    username: root              # Change to your MySQL username
    password: root              # Change to your MySQL password
```

### Step 3: Run the Application

#### Option A: Frontend dev + backend
```bash
cd c:\Users\Parth\ProjectAtlas\frontend
npm install
npm run dev
```

In a second terminal:

```bash
cd c:\Users\Parth\ProjectAtlas
mvn spring-boot:run
```

Frontend: `http://localhost:5173`
Backend API: `http://localhost:8080/api`

#### Option B: Integrated Spring Boot run
Build the React frontend into Spring's static folder first:

```bash
cd c:\Users\Parth\ProjectAtlas\frontend
npm install
npm run build
```

Then run the backend:

```bash
cd c:\Users\Parth\ProjectAtlas
mvn spring-boot:run
```

The application will be available at: **http://localhost:8080**

#### Option C: Using JAR File
```bash
cd c:\Users\Parth\ProjectAtlas\target
java -jar project-atlas-1.0.0.jar
```

#### Option D: Using VS Code Run/Debug
1. Press `Ctrl+Shift+D` to open Run and Debug view
2. Click "Run and Debug" or press F5
3. Select "Java" environment

### Step 4: Verify Application is Running

The integrated application should start on: **http://localhost:8080**

Check logs for: `ProjectAtlasApplication started successfully`

## 📚 API Endpoints

Once running, access these endpoints:

### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects/{id}` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project
- `POST /api/projects/{id}/view` - Record view

### Discovery Feed
- `GET /api/discovery/feed` - All projects
- `GET /api/discovery/trending` - Trending projects
- `GET /api/discovery/high-impact` - High-impact projects
- `GET /api/discovery/recent` - Recent projects
- `GET /api/discovery/underrated` - Underrated gems

### Search & Filtering
- `GET /api/search?keyword=java` - Search by keyword
- `GET /api/search/filter/difficulty/INTERMEDIATE` - Filter by difficulty
- `GET /api/search/filter/category/BACKEND` - Filter by category
- `GET /api/search/filter/impact/7` - Filter by minimum impact score

### Project Scoring
- `GET /api/scoring/project/{id}` - Get project score
- `GET /api/scoring/fit?userSkillLevel=INTERMEDIATE&projectDifficulty=ADVANCED` - Get fit score

### User Collections (Bookmarks)
- `GET /api/collections/user/{userId}` - Get user's bookmarks
- `POST /api/collections/user/{userId}/project/{projectId}` - Add bookmark
- `PUT /api/collections/{collectionId}` - Update bookmark status
- `DELETE /api/collections/{collectionId}?projectId={projectId}` - Remove bookmark

## 📊 Sample Data

The database includes pre-populated data:

**Users:**
- john_dev (Intermediate level)
- alice_coder (Advanced level)
- bob_junior (Beginner level)

**Sample Projects:**
1. E-commerce Order Management System
2. Real-time Notification Service
3. Container Orchestration Dashboard
4. Multi-tenant SaaS Platform
5. Data Pipeline & Analytics Engine
6. Payment Gateway Integration
7. Code Quality Monitoring Tool
8. Task Management REST API

## 🧪 Testing the API

### Using cURL

```bash
# Get all projects
curl http://localhost:8080/api/projects

# Get trending projects
curl http://localhost:8080/api/discovery/trending

# Get specific project
curl http://localhost:8080/api/projects/1

# Search for projects
curl "http://localhost:8080/api/search?keyword=Java"

# Get project score
curl http://localhost:8080/api/scoring/project/1
```

### Using Postman

1. Create new GET request
2. Set URL: `http://localhost:8080/api/projects`
3. Click Send
4. Response will show project list

## 🔧 Troubleshooting

### Port Already in Use
If port 8080 is already in use, change it in `application.yml`:
```yaml
server:
  port: 8081  # Change to available port
```

### Database Connection Failed
Check:
1. MySQL service is running
2. Credentials in `application.yml` are correct
3. Database `project_atlas` exists
4. Schema and seed data have been loaded

### Compilation Issues
If you need to rebuild:
```bash
mvn clean install -DskipTests
```

## 📁 Project Structure

```
ProjectAtlas/
├── src/
│   ├── main/
│   │   ├── java/com/projectatlas/
│   │   │   ├── config/           # Spring configuration
│   │   │   ├── controller/       # REST endpoints
│   │   │   ├── service/          # Business logic
│   │   │   ├── repository/       # Data access
│   │   │   ├── entity/           # Database models
│   │   │   ├── dto/              # API models
│   │   │   └── util/             # Utilities
│   │   └── resources/
│   │       ├── application.yml   # Config file
│   │       └── db/
│   │           ├── schema.sql    # Database schema
│   │           └── seed-data.sql # Sample data
│   └── test/
├── pom.xml                        # Maven configuration
├── README.md                      # Full documentation
└── target/
    └── project-atlas-1.0.0.jar  # Compiled JAR
```

## 🎯 Next Steps

1. ✅ Build successful
2. ✅ Setup database and load schema
3. ✅ Configure credentials
4. ✅ Run application
5. Test API endpoints with sample data
6. Continue iterating in `frontend/` for the React + Tailwind UI
7. Deploy to production

## 📝 Notes

- **CORS**: Enabled for all origins (configure in production)
- **Database**: Currently set to `ddl-auto: update` (auto-creates/updates schema)
- **Logging**: INFO level by default, DEBUG for com.projectatlas package
- **Tests**: Skipped during build (can be enabled with `mvn test`)

## 📞 Support

For issues or questions:
1. Check [README.md](README.md) for detailed documentation
2. Review [copilot-instructions.md](.github/copilot-instructions.md) for development guidelines
3. Check application logs for error messages

---

**Status**: ✅ Ready to run!
**Last Updated**: 2026-04-22
