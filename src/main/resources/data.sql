-- ProjectAtlas Seed Data
-- Sample data for development and testing

-- Users
INSERT INTO users (user_id, username, email, password, full_name, skill_level, preferred_tech_stack) VALUES
(1, 'john_dev', 'john@example.com', 'hashedpassword123', 'John Developer', 'INTERMEDIATE', 'Java, Spring Boot'),
(2, 'alice_coder', 'alice@example.com', 'hashedpassword456', 'Alice Coder', 'ADVANCED', 'Python, Django'),
(3, 'bob_junior', 'bob@example.com', 'hashedpassword789', 'Bob Junior', 'BEGINNER', 'JavaScript, React')
;

-- Sample Projects
INSERT INTO projects (title, description, short_hook, difficulty, category, tech_stack, impact_score, uniqueness_score, learning_potential, resume_value, is_trending, view_count, bookmark_count) VALUES
('E-commerce Order Management System', 'A microservices-based order processing system with advanced queue management and analytics', 'Build a scalable order service with real-time processing', 'INTERMEDIATE', 'BACKEND', 'Java, Spring Boot, MySQL, Redis, RabbitMQ', 8, 7, 9, 9, true, 150, 45),
('Real-time Notification Service', 'High-throughput notification system supporting multiple channels (email, SMS, push)', 'Master event-driven architecture with high concurrency', 'ADVANCED', 'BACKEND', 'Java, Spring Boot, Kafka, PostgreSQL, WebSocket', 9, 8, 9, 10, true, 200, 60),
('Container Orchestration Dashboard', 'Kubernetes cluster manager with monitoring and auto-scaling capabilities', 'Learn container orchestration and infrastructure automation', 'ADVANCED', 'DEVOPS', 'Docker, Kubernetes, Go, Prometheus', 8, 8, 8, 8, false, 120, 35),
('Multi-tenant SaaS Platform', 'Complete multi-tenant application with tenant isolation and billing system', 'Build enterprise-grade multi-tenant architecture', 'ADVANCED', 'MICROSERVICES', 'Java, Spring Cloud, PostgreSQL, Docker', 9, 9, 10, 10, true, 180, 70),
('Data Pipeline & Analytics Engine', 'ETL pipeline processing large datasets with real-time analytics', 'Learn big data processing and analytics', 'INTERMEDIATE', 'DATA_ENGINEERING', 'Python, Apache Spark, PostgreSQL, Airflow', 8, 7, 9, 8, false, 110, 40),
('Payment Gateway Integration', 'Secure payment processing service with PCI compliance', 'Master secure payment processing and third-party integrations', 'INTERMEDIATE', 'API_SERVICE', 'Java, Spring Boot, PostgreSQL, Stripe API', 8, 6, 7, 9, false, 95, 32),
('Code Quality Monitoring Tool', 'Automated code analysis and quality metrics collection', 'Build developer tools and automation systems', 'INTERMEDIATE', 'TOOL_UTILITY', 'Java, Spring Boot, MySQL, SonarQube', 7, 8, 8, 7, false, 80, 28),
('Task Management REST API', 'Simple yet complete task management system demonstrating CRUD operations', 'Learn REST API fundamentals and database design', 'BEGINNER', 'LEARNING_PROJECT', 'Java, Spring Boot, MySQL', 5, 4, 8, 6, false, 300, 100),
('Distributed Logging Framework', 'A high-performance logging system with log rotation and cloud syncing', 'Build a reliable logging backbone for microservices', 'ADVANCED', 'BACKEND', 'Java, Spring Boot, Logback, AWS S3', 8, 7, 9, 8, true, 45, 12),
('Personal Finance Tracker', 'Automated expense tracking with bank sync and budget alerts', 'Take control of your finances with smart categorization', 'INTERMEDIATE', 'FULL_STACK', 'React, Node.js, Plaid API, MongoDB', 7, 6, 8, 7, false, 89, 22),
('Smart IoT Home Hub', 'Centralized dashboard for controlling smart devices with voice support', 'Connect and automate your home with a unified hub', 'ADVANCED', 'IOT', 'Python, Raspberry Pi, MQTT, React', 9, 8, 9, 9, true, 120, 31),
('Secure File Vault', 'End-to-end encrypted file storage with secure sharing links', 'Protect your sensitive data with military-grade encryption', 'ADVANCED', 'CYBERSECURITY', 'Java, Spring Security, AES-256, React', 9, 9, 10, 10, true, 160, 42),
('AI-Powered Resume Optimizer', 'Analyzes resumes against job descriptions using NLP', 'Get past the ATS with AI-driven resume improvements', 'INTERMEDIATE', 'API_SERVICE', 'Python, OpenAI API, Flask, React', 8, 7, 9, 8, true, 210, 55),
('Decentralized Voting System', 'Blockchain-based voting platform for transparent elections', 'Ensure fair and immutable voting with blockchain', 'ADVANCED', 'BLOCKCHAIN', 'Solidity, Ethereum, Web3.js, React', 9, 10, 10, 10, false, 75, 18),
('Real-time Stock Monitor', 'Dashboard with live stock price updates and technical indicators', 'Track the market in real-time with advanced charting', 'INTERMEDIATE', 'API_SERVICE', 'JavaScript, WebSocket, Alpha Vantage API, Chart.js', 7, 6, 8, 7, false, 110, 25),
('Automated Bug Tracker', 'Lightweight issue tracker with GitHub integration and mail alerts', 'Simplify your development workflow with easy bug tracking', 'BEGINNER', 'LEARNING_PROJECT', 'Java, Spring Boot, MySQL, React', 6, 5, 7, 7, false, 55, 12),
('Recipe Recommendation Engine', 'Suggests recipes based on available ingredients and dietary preferences', 'Find your next meal with smart ingredient matching', 'BEGINNER', 'LEARNING_PROJECT', 'Python, Flask, SQLite, React', 6, 6, 7, 6, false, 95, 20),
('Virtual Classroom Platform', 'Video conferencing with shared whiteboard and assignment management', 'Bridge the gap in remote education with interactive tools', 'ADVANCED', 'FULL_STACK', 'React, WebRTC, Socket.io, Node.js', 9, 8, 9, 9, true, 300, 85),
('Custom CLI Tool for Devs', 'Command-line tool to automate repetitive development tasks', 'Boost your productivity with custom shell commands', 'BEGINNER', 'TOOL_UTILITY', 'Go, Cobra, Shell scripting', 7, 7, 8, 8, false, 40, 10),
('Weather Analytics Dashboard', 'Historical weather data analysis and future trend prediction', 'Discover climate patterns with data-driven insights', 'INTERMEDIATE', 'DATA_ENGINEERING', 'Python, Pandas, Matplotlib, OpenWeatherMap API', 7, 6, 9, 7, false, 65, 15),
('Gym Workout Planner', 'Personalized workout routines with progress tracking and video guides', 'Achieve your fitness goals with a data-backed planner', 'INTERMEDIATE', 'MOBILE_APP', 'React Native, Firebase, Node.js', 8, 7, 8, 8, true, 140, 38),
('Multi-player Chess Engine', 'Online chess game with Elo rating and AI opponent', 'Challenge friends or AI to a game of strategy', 'ADVANCED', 'GAME_DEVELOPMENT', 'Java, Spring Boot, WebSocket, Stockfish API', 8, 8, 10, 9, false, 180, 45),
('Microservices Monitoring tool', 'Unified dashboard for health checks and metric collection for microservices', 'Keep your distributed system healthy with real-time monitoring', 'ADVANCED', 'MICROSERVICES', 'Java, Spring Boot, Prometheus, Grafana', 9, 9, 9, 10, true, 220, 62),
('URL Shortener with Analytics', 'Custom short links with detailed click tracking and geo-location', 'Share links and track performance with ease', 'BEGINNER', 'LEARNING_PROJECT', 'Python, Flask, Redis, PostgreSQL', 6, 5, 8, 7, false, 130, 28),
('Collaborative Markdown Editor', 'Real-time collaborative editing with live preview and version history', 'Write documentation together in real-time', 'INTERMEDIATE', 'FULL_STACK', 'React, Node.js, Socket.io, MongoDB', 8, 7, 8, 8, true, 90, 24),
('E-book Library Manager', 'Organize and read your digital books with metadata syncing', 'Manage your digital library like a pro', 'BEGINNER', 'LEARNING_PROJECT', 'Java, Spring Boot, H2, Thymeleaf', 5, 6, 7, 6, false, 45, 10),
('Language Learning App', 'Interactive flashcards and pronunciation practice using speech-to-text', 'Master a new language with AI-driven practice', 'INTERMEDIATE', 'MOBILE_APP', 'Flutter, Firebase, Google Cloud Speech API', 8, 8, 9, 9, true, 175, 48),
('Image Processing API', 'REST API for resizing, filtering, and converting images on the fly', 'Simple image manipulation for your applications', 'INTERMEDIATE', 'API_SERVICE', 'Go, ImageMagick, Fiber', 7, 7, 8, 8, false, 60, 14),
('Serverless Contact Form', 'Backend for contact forms using Lambda functions and SES', 'Add contact forms to static sites without a server', 'BEGINNER', 'DEVOPS', 'AWS Lambda, API Gateway, SES, JavaScript', 6, 7, 9, 7, false, 85, 20),
('Social Media Sentiment Bot', 'Analyzes social media trends to determine brand sentiment', 'Listen to your audience with AI sentiment analysis', 'ADVANCED', 'DATA_ENGINEERING', 'Python, Scrapy, TextBlob, React', 9, 8, 9, 9, true, 190, 52)
;

-- Sample Project Details
INSERT INTO project_details (detail_id, project_id, overview, core_logic, system_architecture, common_mistakes, what_impresses) VALUES
(1, 1, 'An enterprise-grade order management system handling thousands of concurrent orders with real-time status updates', 'Order processing uses event sourcing with transaction logs. State changes trigger async handlers through message queues. Compensation transactions handle failures.', 'Microservices: API Gateway -> Order Service -> Inventory -> Payment -> Notification. Event bus connects services. Cache layer (Redis) for performance.', 'Not handling concurrent order modifications. Ignoring transaction consistency. Poor error recovery patterns. Insufficient testing of failure scenarios.', 'Implementing circuit breakers. Using saga pattern for distributed transactions. Comprehensive monitoring. Clean separation of concerns. Good observability.'),
(2, 2, 'High-throughput notification service supporting email, SMS, and push notifications with guaranteed delivery', 'Uses Kafka for reliable message queuing. Consumer groups ensure parallel processing. Dead letter queues handle failures. Template engine for message rendering.', 'Producer receives requests -> Kafka topic -> Multiple consumer groups -> Channel-specific handlers -> Third-party providers. Retry mechanism with exponential backoff.', 'Assuming synchronous delivery. Not handling provider failures. Poor rate limiting. Ignoring message deduplication.', 'Implementing reliable delivery patterns. Using async/await properly. Comprehensive error handling. Monitoring queue depths. Clean logging.')
;

-- Project Levels
INSERT INTO project_levels (level_id, project_id, level_type, description, requirements, estimated_hours, features) VALUES
(1, 1, 'BEGINNER', 'Basic order creation and status tracking', 'Basic REST API, simple database schema', 30, 'Create order, View order, Update status, Simple filtering'),
(2, 1, 'INTERMEDIATE', 'Multi-service order processing with basic queue management', 'Microservices basics, message queues, JWT', 60, 'Order service, Inventory integration, Payment processing, Email notifications'),
(3, 1, 'ADVANCED', 'Fully distributed system with advanced patterns', 'Event sourcing, saga pattern, distributed tracing', 120, 'Complete microservices, Event sourcing, Compensation transactions, Monitoring, Analytics')
;

-- Upgrade Suggestions
INSERT INTO upgrade_suggestions (suggestion_id, project_id, title, description, complexity, impact_level) VALUES
(1, 1, 'Add Advanced Analytics', 'Implement sales analytics and reporting dashboard', 'MEDIUM', 'HIGH'),
(2, 1, 'Implement Fraud Detection', 'Add ML-based fraud detection for orders', 'HIGH', 'HIGH'),
(3, 1, 'Multi-currency Support', 'Support multiple currencies with real-time conversion', 'MEDIUM', 'MEDIUM'),
(4, 2, 'Template System', 'Advanced template engine with personalization', 'MEDIUM', 'MEDIUM'),
(5, 2, 'A/B Testing Framework', 'Build framework for testing notification variants', 'HIGH', 'HIGH')
;
