const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql } = require('@vercel/postgres');

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
        // Check if user already exists
        const existingUser = await sql`SELECT * FROM users WHERE username = ${username.toLowerCase()}`;
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'Username already taken' });
        }

        // Hash PIN
        const pin_hash = await bcrypt.hash(pin, 10);

        // Create user
        const newUser = await sql`
            INSERT INTO users (username, pin_hash, created_at)
            VALUES (${username.toLowerCase()}, ${pin_hash}, NOW())
            RETURNING id, username, created_at
        `;
        const user = newUser.rows[0];

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
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};