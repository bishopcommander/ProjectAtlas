# ProjectAtlas

Developer Project Discovery, Inspiration & Decision Engine

## Overview

ProjectAtlas is a backend-focused platform designed to help developers discover, evaluate, and plan high-impact project ideas through a combination of inspiration-driven browsing and intelligent decision-making tools.

### Core Features

- **Inspiration Layer**: Scrollable feed of curated project ideas
- **Decision Engine**: Structured evaluation and scoring system
- **Smart Search & Filtering**: Chat-style natural language search
- **Project Breakdowns**: Comprehensive project details with levels
- **Personalization**: AI-driven recommendations
- **Save & Track**: Bookmark and monitor project progress

## Tech Stack

- **Backend**: Java 17, Spring Boot 3.1.5
- **Database**: MySQL 8.0
- **Build Tool**: Maven
- **Frontend**: React 18, Tailwind CSS, Vite
- **Architecture**: REST API with microservices-ready design

## Prerequisites

- Java 17+
- Maven 3.8+
- MySQL 8.0+

## Setup Instructions

### 1. Database Setup

```bash
mysql -u root -p
```

```sql
CREATE DATABASE project_atlas;
USE project_atlas;

-- Run the schema file
SOURCE src/main/resources/db/schema.sql;
SOURCE src/main/resources/db/seed-data.sql;
```

### 2. Application Setup

1. Clone the repository
2. Navigate to the project directory
3. Update `src/main/resources/application.yml` with your MySQL credentials
4. Install frontend dependencies:

```bash
cd frontend
npm install
```

5. Run Maven build:

```bash
mvn clean install
```

### 3. Running the Application

For frontend development with hot reload:

```bash
cd frontend
npm run dev
```

Then run the backend in a separate terminal:

```bash
mvn spring-boot:run
```

The frontend dev server will be available at `http://localhost:5173` and proxies API calls to `http://localhost:8080/api`.

For an integrated Spring Boot run, build the frontend first:

```bash
cd frontend
npm run build
```

This writes the production React app to `src/main/resources/static`, and Spring Boot will serve it on `http://localhost:8080`.

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects with filtering
- `GET /api/projects/{id}` - Get project details
- `GET /api/projects/{id}/breakdown` - Get full decision-engine breakdown
- `GET /api/projects/recommendations/user/{userId}` - Get personalized recommendations
- `GET /api/projects/random` - Get a random project idea
- `POST /api/projects` - Create new project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Discovery Feed
- `GET /api/discovery/feed` - Get discovery feed with categories
- `GET /api/discovery/trending` - Get trending projects
- `GET /api/discovery/high-impact` - Get high-impact projects
- `GET /api/discovery/backend-focused` - Get backend-heavy project ideas

### Search & Filtering
- `GET /api/search` - Advanced search with natural language parsing
- `GET /api/search/smart?query=backend project with java medium difficulty` - Parse natural language to filters
- `POST /api/search/filter` - Combine structured filters in one request
- `GET /api/filters` - Get available filters

### Scoring & Evaluation
- `GET /api/projects/{id}/score` - Get project evaluation score
- `POST /api/projects/{id}/evaluate` - Evaluate project fit

### User Collections
- `GET /api/collections` - Get user's bookmarks
- `POST /api/collections` - Bookmark a project
- `DELETE /api/collections/{projectId}` - Remove bookmark

## Project Structure

```
src/main/java/com/projectatlas/
├── config/              # Spring configuration classes
├── controller/          # REST API controllers
├── entity/              # JPA entity models
├── repository/          # Data access layer
├── service/             # Business logic layer
├── dto/                 # Data transfer objects
└── util/                # Utility classes

src/main/resources/
├── application.yml      # Application configuration
└── db/                  # Database scripts
    ├── schema.sql
    └── seed-data.sql
```

## Database Schema

### Core Tables
- **users** - User accounts
- **projects** - Project ideas
- **project_tags** - Tags/categories
- **project_details** - Extended project information
- **project_levels** - Beginner/Intermediate/Advanced variants
- **user_collections** - Bookmarks
- **project_metrics** - Evaluation scores

## Development

### Building
```bash
mvn clean package
```

### Running Tests
```bash
mvn test
```

### Code Quality
```bash
mvn clean verify
```

## Configuration

Edit `src/main/resources/application.yml` for:
- Database connection settings
- Server port and context path
- Logging levels
- JPA/Hibernate settings

## License

MIT

## Support

For issues and questions, please open an issue on the repository.
