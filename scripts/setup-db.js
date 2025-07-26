const { Pool } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    const pool = new Pool({
        connectionString: process.env.POSTGRES_URL
    });

    try {
        console.log('Setting up database...');
        
        // Read schema file
        const schema = fs.readFileSync(path.join(__dirname, '..', 'schema.sql'), 'utf8');
        
        // Execute schema
        await pool.query(schema);
        
        console.log('Database setup completed successfully!');
    } catch (error) {
        console.error('Database setup failed:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

setupDatabase();