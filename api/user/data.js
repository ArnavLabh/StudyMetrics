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
    return jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key');
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
                return res.status(200).json({ 
                    userData: { 
                        courses: {}, 
                        electives: [],
                        dataScienceOptions: {
                            analytics: true,
                            project: true
                        }
                    } 
                });
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