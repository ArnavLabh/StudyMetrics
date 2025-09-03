const { spawn } = require('child_process');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key');
        
        const { userData } = req.body;
        const python = spawn('python', ['analytics.py', JSON.stringify(userData)]);
        
        let output = '';
        python.stdout.on('data', (data) => output += data);
        
        python.on('close', (code) => {
            if (code === 0) {
                try {
                    const result = JSON.parse(output);
                    res.json(result);
                } catch (e) {
                    res.status(500).json({ error: 'Parse error' });
                }
            } else {
                res.status(500).json({ error: 'Python execution failed' });
            }
        });
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};