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

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return res.status(400).json({ message: 'Username can only contain letters, numbers, and underscores' });
    }

    if (!/^\d{4}$/.test(pin)) {
        return res.status(400).json({ message: 'PIN must be 4 digits' });
    }

    try {
        // Check if username exists
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE username = $1',
            [username.toLowerCase()]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        // Hash PIN
        const pinHash = await bcrypt.hash(pin, 10);

        // Create user
        const result = await pool.query(
            'INSERT INTO users (username, pin_hash) VALUES ($1, $2) RETURNING id, username, created_at',
            [username.toLowerCase(), pinHash]
        );

        const user = result.rows[0];

        // Initialize user data
        await pool.query(
            'INSERT INTO user_data (user_id) VALUES ($1)',
            [user.id]
        );

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET || 'dev-secret-key',
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