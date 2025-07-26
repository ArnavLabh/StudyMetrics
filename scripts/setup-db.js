const { sql } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    try {
        console.log('Setting up database...');
        
        // Read schema file
        const schema = fs.readFileSync(path.join(__dirname, '..', 'schema.sql'), 'utf8');
        
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
    } catch (error) {
        console.error('Database setup failed:', error);
        process.exit(1);
    }
}

setupDatabase();