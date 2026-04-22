# ProjectAtlas - Development Guidelines

## Project Type
Java Spring Boot Backend REST API

## Technology Stack
- **Language**: Java 17
- **Framework**: Spring Boot 3.1.5
- **Database**: MySQL 8.0
- **Build Tool**: Maven 3.8+

## Development Workflow

### Building the Project
```bash
mvn clean install
```

### Running the Application
```bash
mvn spring-boot:run
```

### Running Tests
```bash
mvn test
```

### Database Setup
1. Create MySQL database: `project_atlas`
2. Run schema scripts in `src/main/resources/db/`
3. Update credentials in `application.yml`

## Code Structure

**Layers**:
- `config/` - Spring configuration and beans
- `controller/` - REST API endpoints
- `service/` - Business logic
- `repository/` - Data access (JPA)
- `entity/` - Database models
- `dto/` - API request/response models
- `util/` - Helper utilities

## API Convention

- Base Path: `/api`
- Port: 8080
- Format: RESTful with JSON
- Versioning: Header-based (X-API-Version)

## Database Conventions

- Tables: `snake_case`
- Columns: `snake_case`
- IDs: `entity_id` (primary key)
- Timestamps: `created_at`, `updated_at`

## Naming Conventions

- Classes: `PascalCase`
- Methods: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Package structure: `com.projectatlas.{module}`

## Important Notes

- Use Lombok annotations to reduce boilerplate
- Implement proper exception handling
- Add validation annotations for input
- Use DTOs to separate API from database models
- Implement pagination for large result sets

## Setup Checklist

- [ ] Database created and schema loaded
- [ ] MySQL credentials configured
- [ ] Maven dependencies installed
- [ ] Application starts without errors
- [ ] API endpoints accessible at http://localhost:8080/api

