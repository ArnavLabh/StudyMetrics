-- StudyMetrics Database Schema
-- PostgreSQL Database Setup for IITMBS CGPA Calculator

-- Drop existing tables if needed (careful in production!)
-- DROP TABLE IF EXISTS sessions CASCADE;
-- DROP TABLE IF EXISTS user_data CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    pin_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    
    -- Constraints
    CONSTRAINT username_length CHECK (LENGTH(username) >= 3 AND LENGTH(username) <= 20),
    CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]+$')
);

-- Create user_data table
CREATE TABLE IF NOT EXISTS user_data (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    course_data JSONB NOT NULL DEFAULT '{"courses": {}, "electives": [], "dataScienceOptions": {"analytics": true, "project": true}}',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure one record per user
    UNIQUE(user_id)
);

-- Create sessions table for tracking activity
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    ip_address INET,
    user_agent TEXT,
    
    -- Ensure token uniqueness
    UNIQUE(token_hash)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login);
CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON user_data(user_id);
CREATE INDEX IF NOT EXISTS idx_user_data_updated_at ON user_data(updated_at);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Create GIN index for JSONB queries
CREATE INDEX IF NOT EXISTS idx_user_data_course_data ON user_data USING GIN (course_data);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_user_data_updated_at ON user_data;
CREATE TRIGGER update_user_data_updated_at 
    BEFORE UPDATE ON user_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions() 
RETURNS void AS $$
BEGIN
    DELETE FROM sessions 
    WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up inactive users (1 year of inactivity)
CREATE OR REPLACE FUNCTION cleanup_inactive_users() 
RETURNS void AS $$
BEGIN
    -- Mark users as inactive first
    UPDATE users 
    SET is_active = false 
    WHERE (last_login < CURRENT_TIMESTAMP - INTERVAL '11 months' 
           OR (last_login IS NULL AND created_at < CURRENT_TIMESTAMP - INTERVAL '11 months'))
    AND is_active = true;
    
    -- Delete users inactive for more than 1 year
    DELETE FROM users 
    WHERE (last_login < CURRENT_TIMESTAMP - INTERVAL '1 year' 
           OR (last_login IS NULL AND created_at < CURRENT_TIMESTAMP - INTERVAL '1 year'))
    AND is_active = false;
END;
$$ LANGUAGE plpgsql;

-- Function to delete old users (8 years retention)
CREATE OR REPLACE FUNCTION cleanup_old_users() 
RETURNS void AS $$
BEGIN
    DELETE FROM users 
    WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '8 years';
END;
$$ LANGUAGE plpgsql;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats()
RETURNS TABLE(
    total_users BIGINT,
    active_users BIGINT,
    users_with_data BIGINT,
    avg_courses_per_user NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT u.id) as total_users,
        COUNT(DISTINCT CASE WHEN u.is_active THEN u.id END) as active_users,
        COUNT(DISTINCT ud.user_id) as users_with_data,
        AVG(CASE 
            WHEN jsonb_typeof(ud.course_data->'courses') = 'object' 
            THEN (SELECT COUNT(*) FROM jsonb_object_keys(ud.course_data->'courses'))
            ELSE 0 
        END) as avg_courses_per_user
    FROM users u
    LEFT JOIN user_data ud ON u.id = ud.user_id;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_db_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_db_user;