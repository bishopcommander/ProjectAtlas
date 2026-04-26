-- ProjectAtlas Database Schema
-- MySQL 8.0+

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    bio VARCHAR(500),
    skill_level VARCHAR(50),
    preferred_tech_stack TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    project_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    short_hook VARCHAR(500),
    difficulty VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    tech_stack TEXT,
    impact_score INT,
    uniqueness_score INT,
    learning_potential INT,
    resume_value INT,
    is_trending BOOLEAN DEFAULT false,
    view_count BIGINT DEFAULT 0,
    bookmark_count BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_difficulty (difficulty),
    INDEX idx_category (category),
    INDEX idx_is_trending (is_trending),
    INDEX idx_impact_score (impact_score),
    INDEX idx_created_at (created_at)
);

-- Project Details Table
CREATE TABLE IF NOT EXISTS project_details (
    detail_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    project_id BIGINT NOT NULL,
    overview TEXT,
    core_logic TEXT,
    system_architecture TEXT,
    common_mistakes TEXT,
    what_impresses TEXT,
    key_learnings TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    UNIQUE KEY uk_project_id (project_id)
);

-- Project Levels Table
CREATE TABLE IF NOT EXISTS project_levels (
    level_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    project_id BIGINT NOT NULL,
    level_type VARCHAR(50) NOT NULL,
    description TEXT,
    requirements TEXT,
    estimated_hours INT,
    features TEXT,
    implementation_tips TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id),
    INDEX idx_level_type (level_type)
);

-- Upgrade Suggestions Table
CREATE TABLE IF NOT EXISTS upgrade_suggestions (
    suggestion_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    project_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    complexity VARCHAR(50),
    implementation_tips TEXT,
    impact_level VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id)
);

-- User Collections Table (Bookmarks)
CREATE TABLE IF NOT EXISTS user_collections (
    collection_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    bookmarked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_project (user_id, project_id),
    INDEX idx_user_id (user_id),
    INDEX idx_project_id (project_id),
    INDEX idx_status (status)
);

-- Additional indexes can be added later through migrations if needed.
