const { Pool } = require('@vercel/postgres');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
});

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Get aggregate statistics (anonymized)
        const stats = await pool.query('SELECT * FROM get_user_stats()');

        res.status(200).json({
            statistics: stats.rows[0],
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error('Statistics error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};