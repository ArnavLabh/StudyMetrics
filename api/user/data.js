const jwt = require('jsonwebtoken');
const { sql } = require('@vercel/postgres');

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
            const result = await sql`SELECT course_data FROM user_data WHERE user_id = ${decoded.userId}`;

            if (result.rows.length === 0) {
                // Create a new user_data row for this user
                const defaultData = {
                    courses: {},
                    electives: [],
                    dataScienceOptions: {
                        analytics: true,
                        project: true
                    }
                };
                await sql`INSERT INTO user_data (user_id, course_data) VALUES (${decoded.userId}, ${JSON.stringify(defaultData)}) ON CONFLICT (user_id) DO NOTHING`;
                return res.status(200).json({ userData: defaultData });
            }

            res.status(200).json({ userData: result.rows[0].course_data });

        } else if (req.method === 'POST') {
            // Save user data
            const { userData } = req.body;

            if (!userData) {
                return res.status(400).json({ message: 'No data provided' });
            }

            await sql`INSERT INTO user_data (user_id, course_data, updated_at) VALUES (${decoded.userId}, ${JSON.stringify(userData)}, NOW()) ON CONFLICT (user_id) DO UPDATE SET course_data = ${JSON.stringify(userData)}, updated_at = NOW()`;

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