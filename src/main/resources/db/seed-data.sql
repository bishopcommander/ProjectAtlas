-- ProjectAtlas Seed Data
-- Sample data for development and testing

-- Users
INSERT INTO users (user_id, username, email, password, full_name, skill_level, preferred_tech_stack) VALUES
(1, 'john_dev', 'john@example.com', 'hashedpassword123', 'John Developer', 'INTERMEDIATE', 'Java, Spring Boot'),
(2, 'alice_coder', 'alice@example.com', 'hashedpassword456', 'Alice Coder', 'ADVANCED', 'Python, Django'),
(3, 'bob_junior', 'bob@example.com', 'hashedpassword789', 'Bob Junior', 'BEGINNER', 'JavaScript, React')
;

-- Sample Projects
INSERT INTO projects (project_id, title, description, short_hook, difficulty, category, tech_stack, impact_score, uniqueness_score, learning_potential, resume_value, is_trending, view_count, bookmark_count) VALUES
(1, 'E-commerce Order Management System',
'A microservices-based order processing system with advanced queue management and analytics',
'Build a scalable order service with real-time processing',
'INTERMEDIATE', 'BACKEND', 'Java, Spring Boot, MySQL, Redis, RabbitMQ',
8, 7, 9, 9, true, 150, 45),
(2, 'Real-time Notification Service',
'High-throughput notification system supporting multiple channels (email, SMS, push)',
'Master event-driven architecture with high concurrency',
'ADVANCED', 'BACKEND', 'Java, Spring Boot, Kafka, PostgreSQL, WebSocket',
9, 8, 9, 10, true, 200, 60),
(3, 'Container Orchestration Dashboard',
'Kubernetes cluster manager with monitoring and auto-scaling capabilities',
'Learn container orchestration and infrastructure automation',
'ADVANCED', 'DEVOPS', 'Docker, Kubernetes, Go, Prometheus',
8, 8, 8, 8, false, 120, 35),
(4, 'Multi-tenant SaaS Platform',
'Complete multi-tenant application with tenant isolation and billing system',
'Build enterprise-grade multi-tenant architecture',
'ADVANCED', 'MICROSERVICES', 'Java, Spring Cloud, PostgreSQL, Docker',
9, 9, 10, 10, true, 180, 70),
(5, 'Data Pipeline & Analytics Engine',
'ETL pipeline processing large datasets with real-time analytics',
'Learn big data processing and analytics',
'INTERMEDIATE', 'DATA_ENGINEERING', 'Python, Apache Spark, PostgreSQL, Airflow',
8, 7, 9, 8, false, 110, 40),
(6, 'Payment Gateway Integration',
'Secure payment processing service with PCI compliance',
'Master secure payment processing and third-party integrations',
'INTERMEDIATE', 'API_SERVICE', 'Java, Spring Boot, PostgreSQL, Stripe API',
8, 6, 7, 9, false, 95, 32),
(7, 'Code Quality Monitoring Tool',
'Automated code analysis and quality metrics collection',
'Build developer tools and automation systems',
'INTERMEDIATE', 'TOOL_UTILITY', 'Java, Spring Boot, MySQL, SonarQube',
7, 8, 8, 7, false, 80, 28),
(8, 'Task Management REST API',
'Simple yet complete task management system demonstrating CRUD operations',
'Learn REST API fundamentals and database design',
'BEGINNER', 'LEARNING_PROJECT', 'Java, Spring Boot, MySQL',
5, 4, 8, 6, false, 300, 100)
;

-- Sample Project Details
INSERT INTO project_details (detail_id, project_id, overview, core_logic, system_architecture, common_mistakes, what_impresses) VALUES
(1, 1,
'An enterprise-grade order management system handling thousands of concurrent orders with real-time status updates',
'Order processing uses event sourcing with transaction logs. State changes trigger async handlers through message queues. Compensation transactions handle failures.',
'Microservices: API Gateway -> Order Service -> Inventory -> Payment -> Notification. Event bus connects services. Cache layer (Redis) for performance.',
'Not handling concurrent order modifications. Ignoring transaction consistency. Poor error recovery patterns. Insufficient testing of failure scenarios.',
'Implementing circuit breakers. Using saga pattern for distributed transactions. Comprehensive monitoring. Clean separation of concerns. Good observability.'
),
(2, 2,
'High-throughput notification service supporting email, SMS, and push notifications with guaranteed delivery',
'Uses Kafka for reliable message queuing. Consumer groups ensure parallel processing. Dead letter queues handle failures. Template engine for message rendering.',
'Producer receives requests -> Kafka topic -> Multiple consumer groups -> Channel-specific handlers -> Third-party providers. Retry mechanism with exponential backoff.',
'Assuming synchronous delivery. Not handling provider failures. Poor rate limiting. Ignoring message deduplication.',
'Implementing reliable delivery patterns. Using async/await properly. Comprehensive error handling. Monitoring queue depths. Clean logging.'
)
;

-- Project Levels
INSERT INTO project_levels (level_id, project_id, level_type, description, requirements, estimated_hours, features) VALUES
(1, 1, 'BEGINNER', 'Basic order creation and status tracking', 'Basic REST API, simple database schema', 30,
'Create order, View order, Update status, Simple filtering'),
(2, 1, 'INTERMEDIATE', 'Multi-service order processing with basic queue management', 'Microservices basics, message queues, JWT', 60,
'Order service, Inventory integration, Payment processing, Email notifications'),
(3, 1, 'ADVANCED', 'Fully distributed system with advanced patterns', 'Event sourcing, saga pattern, distributed tracing', 120,
'Complete microservices, Event sourcing, Compensation transactions, Monitoring, Analytics')
;

-- Upgrade Suggestions
INSERT INTO upgrade_suggestions (suggestion_id, project_id, title, description, complexity, impact_level) VALUES
(1, 1, 'Add Advanced Analytics', 'Implement sales analytics and reporting dashboard', 'MEDIUM', 'HIGH'),
(2, 1, 'Implement Fraud Detection', 'Add ML-based fraud detection for orders', 'HIGH', 'HIGH'),
(3, 1, 'Multi-currency Support', 'Support multiple currencies with real-time conversion', 'MEDIUM', 'MEDIUM'),
(4, 2, 'Template System', 'Advanced template engine with personalization', 'MEDIUM', 'MEDIUM'),
(5, 2, 'A/B Testing Framework', 'Build framework for testing notification variants', 'HIGH', 'HIGH')
;
