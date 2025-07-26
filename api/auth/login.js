const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql } = require('@vercel/postgres');

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
        const userResult = await sql`SELECT * FROM users WHERE username = ${username.toLowerCase()}`;

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
        await sql`UPDATE users SET last_login = NOW() WHERE id = ${user.id}`;

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET || 'dev-secret-key',
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