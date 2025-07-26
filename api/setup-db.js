const { sql } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');

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

    try {
        console.log('Setting up database...');
        
        // Read schema file
        const schema = fs.readFileSync(path.join(process.cwd(), 'schema.sql'), 'utf8');
        
        // Split schema into individual statements and execute them
        const statements = schema
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        for (const statement of statements) {
            if (statement.trim()) {
                await sql.unsafe(statement);
            }
        }
        
        console.log('Database setup completed successfully!');
        res.status(200).json({ message: 'Database setup completed successfully!' });
    } catch (error) {
        console.error('Database setup failed:', error);
        res.status(500).json({ message: 'Database setup failed', error: error.message });
    }
}; 