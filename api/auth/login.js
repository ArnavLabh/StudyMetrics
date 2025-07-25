// api/auth/login.js - Vercel Serverless Function
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('@vercel/postgres');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
});

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, pin } = req.body;

    if (!username || !pin || pin.length !== 4) {
        return res.status(400).json({ message: 'Invalid username or PIN' });
    }

    try {
        // Find user
        const userResult = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = userResult.rows[0];

        // Verify PIN
        const isValidPin = await bcrypt.compare(pin, user.pin_hash);
        if (!isValidPin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Update last login
        await pool.query(
            'UPDATE users SET last_login = NOW() WHERE id = $1',
            [user.id]
        );

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).json({
            token,
            user: {
                id: user.id,
                username: user.username,
                createdAt: user.created_at
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// api/auth/register.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('@vercel/postgres');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
});

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, pin } = req.body;

    if (!username || !pin || pin.length !== 4) {
        return res.status(400).json({ message: 'Invalid username or PIN' });
    }

    if (username.length < 3 || username.length > 20) {
        return res.status(400).json({ message: 'Username must be between 3 and 20 characters' });
    }

    if (!/^\d{4}$/.test(pin)) {
        return res.status(400).json({ message: 'PIN must be 4 digits' });
    }

    try {
        // Check if username exists
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE username = $1',
            [username]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        // Hash PIN
        const pinHash = await bcrypt.hash(pin, 10);

        // Create user
        const result = await pool.query(
            'INSERT INTO users (username, pin_hash) VALUES ($1, $2) RETURNING id, username, created_at',
            [username, pinHash]
        );

        const user = result.rows[0];

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            token,
            user: {
                id: user.id,
                username: user.username,
                createdAt: user.created_at
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// api/auth/verify.js
const jwt = require('jsonwebtoken');
const { Pool } = require('@vercel/postgres');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
});

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user info
        const userResult = await pool.query(
            'SELECT id, username, created_at FROM users WHERE id = $1',
            [decoded.userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = userResult.rows[0];

        res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
                createdAt: user.created_at
            }
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        console.error('Verify error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// api/user/data.js - GET and POST user data
const jwt = require('jsonwebtoken');
const { Pool } = require('@vercel/postgres');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
});

// Middleware to verify token
const verifyToken = (req) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        throw new Error('No token provided');
    }
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const decoded = verifyToken(req);

        if (req.method === 'GET') {
            // Get user data
            const result = await pool.query(
                'SELECT course_data FROM user_data WHERE user_id = $1',
                [decoded.userId]
            );

            if (result.rows.length === 0) {
                return res.status(200).json({ userData: { courses: {}, electives: [] } });
            }

            res.status(200).json({ userData: result.rows[0].course_data });

        } else if (req.method === 'POST') {
            // Save user data
            const { userData } = req.body;

            if (!userData) {
                return res.status(400).json({ message: 'No data provided' });
            }

            await pool.query(
                `INSERT INTO user_data (user_id, course_data, updated_at) 
                 VALUES ($1, $2, NOW()) 
                 ON CONFLICT (user_id) 
                 DO UPDATE SET course_data = $2, updated_at = NOW()`,
                [decoded.userId, JSON.stringify(userData)]
            );

            res.status(200).json({ message: 'Data saved successfully' });

        } else {
            res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.message === 'No token provided') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        console.error('User data error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Database Schema (schema.sql)
/*
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    pin_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Create user_data table
CREATE TABLE IF NOT EXISTS user_data (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    course_data JSONB NOT NULL DEFAULT '{"courses": {}, "electives": []}',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    user_agent TEXT
);

-- Create index for faster lookups
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_user_data_user_id ON user_data(user_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);

-- Function to clean up inactive users (1 year of inactivity)
CREATE OR REPLACE FUNCTION cleanup_inactive_users() RETURNS void AS $$
BEGIN
    DELETE FROM users 
    WHERE last_login < NOW() - INTERVAL '1 year' 
    OR (last_login IS NULL AND created_at < NOW() - INTERVAL '1 year');
END;
$$ LANGUAGE plpgsql;

-- Function to delete old users (8 years retention)
CREATE OR REPLACE FUNCTION cleanup_old_users() RETURNS void AS $$
BEGIN
    DELETE FROM users 
    WHERE created_at < NOW() - INTERVAL '8 years';
END;
$$ LANGUAGE plpgsql;

-- Create scheduled jobs (using pg_cron or external scheduler)
-- SELECT cron.schedule('cleanup-inactive-users', '0 0 * * 0', 'SELECT cleanup_inactive_users();');
-- SELECT cron.schedule('cleanup-old-users', '0 0 1 * *', 'SELECT cleanup_old_users();');
*/