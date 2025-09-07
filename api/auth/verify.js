const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for admin operations
);

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key');
        
        // Check if user still exists and is active
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('id, username, created_at, last_login, is_active')
            .eq('id', decoded.userId)
            .eq('is_active', true)
            .single();

        if (fetchError || !user) {
            return res.status(401).json({ message: 'User not found or inactive' });
        }

        // Update last login
        const { error: updateError } = await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', user.id);

        if (updateError) {
            console.error('Error updating last login:', updateError);
        }

        res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
                createdAt: user.created_at
            }
        });

    } catch (error) {
        console.error('Token verification error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }

        res.status(500).json({ message: 'Server error' });
    }
};