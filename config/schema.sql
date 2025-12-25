-- Enhanced StudyMetrics Database Schema
-- Supports new features: CGPA history, target tracking, and analytics

-- Drop existing tables if they exist (for schema updates)
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS cgpa_history CASCADE;
DROP TABLE IF EXISTS user_data CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table with enhanced fields
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    pin_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255), -- Optional for future use
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    preferences JSONB DEFAULT '{}' -- Store user preferences
);

-- Create user_data table with enhanced structure
CREATE TABLE user_data (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    course_data JSONB NOT NULL DEFAULT '{}',
    target_cgpa DECIMAL(3,2), -- Target CGPA (0.00 to 10.00)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create CGPA history table for tracking progress over time
CREATE TABLE cgpa_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    cgpa DECIMAL(4,2) NOT NULL,
    total_credits INTEGER NOT NULL DEFAULT 0,
    grade_points DECIMAL(8,2) NOT NULL DEFAULT 0,
    semester VARCHAR(20), -- Optional semester tracking
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}' -- Additional metadata
);

-- Create user sessions table for authentication tracking
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Create indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_user_data_user_id ON user_data(user_id);
CREATE INDEX idx_cgpa_history_user_id ON cgpa_history(user_id);
CREATE INDEX idx_cgpa_history_recorded_at ON cgpa_history(user_id, recorded_at);

CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_active ON user_sessions(is_active, expires_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_data_updated_at BEFORE UPDATE ON user_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate user statistics (enhanced)
CREATE OR REPLACE FUNCTION get_user_stats()
RETURNS TABLE (
    total_users INTEGER,
    active_users INTEGER,
    avg_cgpa NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_users,
        COUNT(CASE WHEN u.last_login > NOW() - INTERVAL '30 days' THEN 1 END)::INTEGER as active_users,
        AVG(ch.cgpa) as avg_cgpa
    FROM users u
    LEFT JOIN user_data ud ON u.id = ud.user_id
    LEFT JOIN (
        SELECT DISTINCT ON (user_id) user_id, cgpa
        FROM cgpa_history
        ORDER BY user_id, recorded_at DESC
    ) ch ON u.id = ch.user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get user analytics data
CREATE OR REPLACE FUNCTION get_user_analytics(p_user_id INTEGER)
RETURNS TABLE (
    current_cgpa NUMERIC,
    total_credits INTEGER,
    completed_courses INTEGER,
    cgpa_trend JSONB,
    grade_distribution JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ch.cgpa as current_cgpa,
        ch.total_credits,
        (SELECT COUNT(*) FROM jsonb_each(ud.course_data->'courses') WHERE value->>'grade' IS NOT NULL)::INTEGER as completed_courses,
        (SELECT jsonb_agg(
            jsonb_build_object(
                'date', recorded_at::DATE,
                'cgpa', cgpa,
                'credits', total_credits
            ) ORDER BY recorded_at
        ) FROM (
            SELECT recorded_at, cgpa, total_credits 
            FROM cgpa_history 
            WHERE user_id = p_user_id 
            ORDER BY recorded_at DESC 
            LIMIT 10
        ) trend) as cgpa_trend,
        (SELECT jsonb_object_agg(grade, grade_count) FROM (
            SELECT 
                value->>'grade' as grade,
                COUNT(*) as grade_count
            FROM jsonb_each(ud.course_data->'courses')
            WHERE value->>'grade' IS NOT NULL
            GROUP BY value->>'grade'
        ) grades) as grade_distribution
    FROM user_data ud
    LEFT JOIN (
        SELECT DISTINCT ON (user_id) user_id, cgpa, total_credits
        FROM cgpa_history
        WHERE user_id = p_user_id
        ORDER BY user_id, recorded_at DESC
    ) ch ON ud.user_id = ch.user_id
    WHERE ud.user_id = p_user_id
    GROUP BY ch.cgpa, ch.total_credits, ud.course_data;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM user_sessions 
    WHERE expires_at < NOW() OR is_active = false;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to record CGPA history automatically
CREATE OR REPLACE FUNCTION record_cgpa_history()
RETURNS TRIGGER AS $$
DECLARE
    calculated_cgpa NUMERIC;
    total_credits INTEGER;
    total_points NUMERIC;
    course_record RECORD;
    grade_points NUMERIC;
    course_credits INTEGER;
BEGIN
    -- Calculate CGPA from course data
    total_points := 0;
    total_credits := 0;
    
    -- Iterate through courses in the JSON data
    FOR course_record IN 
        SELECT key, value 
        FROM jsonb_each(NEW.course_data->'courses')
        WHERE value->>'grade' IS NOT NULL
    LOOP
        -- Map grades to points
        grade_points := CASE (course_record.value->>'grade')
            WHEN 'S' THEN 10
            WHEN 'A' THEN 9
            WHEN 'B' THEN 8
            WHEN 'C' THEN 7
            WHEN 'D' THEN 6
            WHEN 'E' THEN 4
            ELSE 0
        END;
        
        -- Get credits (default to 4 if not specified)
        course_credits := COALESCE((course_record.value->>'credits')::INTEGER, 4);
        
        total_points := total_points + (grade_points * course_credits);
        total_credits := total_credits + course_credits;
    END LOOP;
    
    -- Calculate CGPA
    IF total_credits > 0 THEN
        calculated_cgpa := ROUND(total_points / total_credits, 2);
        
        -- Insert into CGPA history if it's different from the last record
        INSERT INTO cgpa_history (user_id, cgpa, total_credits, grade_points)
        SELECT NEW.user_id, calculated_cgpa, total_credits, total_points
        WHERE NOT EXISTS (
            SELECT 1 FROM cgpa_history 
            WHERE user_id = NEW.user_id 
            AND ABS(cgpa - calculated_cgpa) < 0.01
            AND recorded_at > NOW() - INTERVAL '1 hour'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically record CGPA history
CREATE TRIGGER record_cgpa_on_course_update
    AFTER INSERT OR UPDATE ON user_data
    FOR EACH ROW 
    WHEN (NEW.course_data IS DISTINCT FROM OLD.course_data OR OLD.course_data IS NULL)
    EXECUTE FUNCTION record_cgpa_history();

-- Insert default admin user (optional, for testing)
-- Password: 1234 (hashed with bcrypt)
INSERT INTO users (username, pin_hash, created_at) VALUES 
('admin', '$2a$10$8K1p/a0ddt8dzuKLx8o7l.Hq2H1PrfGFsJy9VF5Qf.9YQr8GhWi3m', NOW())
ON CONFLICT (username) DO NOTHING;

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO studymetrics_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO studymetrics_app;

-- Add helpful views for common queries
CREATE VIEW user_current_stats AS
SELECT 
    u.id,
    u.username,
    ud.target_cgpa,
    ch.cgpa as current_cgpa,
    ch.total_credits,
    (SELECT COUNT(*) FROM jsonb_each(ud.course_data->'courses') WHERE value->>'grade' IS NOT NULL) as completed_courses,
    u.last_login
FROM users u
LEFT JOIN user_data ud ON u.id = ud.user_id
LEFT JOIN (
    SELECT DISTINCT ON (user_id) user_id, cgpa, total_credits
    FROM cgpa_history
    ORDER BY user_id, recorded_at DESC
) ch ON u.id = ch.user_id
WHERE u.is_active = true;

-- Comments for documentation
COMMENT ON TABLE users IS 'Core user accounts with authentication data';
COMMENT ON TABLE user_data IS 'User academic data including courses, grades, and preferences';
COMMENT ON TABLE cgpa_history IS 'Historical CGPA tracking for trend analysis';
COMMENT ON TABLE user_sessions IS 'Active user authentication sessions';

COMMENT ON FUNCTION get_user_stats() IS 'Returns aggregated statistics for all users';
COMMENT ON FUNCTION get_user_analytics(INTEGER) IS 'Returns comprehensive analytics for a specific user';
COMMENT ON FUNCTION cleanup_expired_sessions() IS 'Removes expired authentication sessions';
