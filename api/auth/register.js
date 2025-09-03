const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql } = require('@vercel/postgres');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { username, pin } = req.body;

        if (!username || !pin) {
            return res.status(400).json({ error: 'Username and PIN are required' });
        }

        if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
            return res.status(400).json({ error: 'PIN must be exactly 4 digits' });
        }

        if (username.length < 3 || username.length > 20) {
            return res.status(400).json({ error: 'Username must be between 3 and 20 characters' });
        }

        const existingUser = await sql`SELECT id FROM users WHERE username = ${username.toLowerCase()}`;

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        const hashedPin = await bcrypt.hash(pin, 10);

        const result = await sql`
            INSERT INTO users (username, pin_hash, created_at, is_active) 
            VALUES (${username.toLowerCase()}, ${hashedPin}, NOW(), true) 
            RETURNING id, username, created_at
        `;

        const user = result.rows[0];

        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET || 'dev-secret-key',
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            token,
            user: {
                id: user.id,
                username: user.username,
                createdAt: user.created_at
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};