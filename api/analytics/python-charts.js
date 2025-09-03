const jwt = require('jsonwebtoken');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

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
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const decoded = verifyToken(req);
        const { userData } = req.body;

        if (!userData) {
            return res.status(400).json({ error: 'User data is required' });
        }

        // Path to Python script
        const pythonScript = path.join(process.cwd(), 'analytics_generator.py');
        
        // Check if Python script exists
        try {
            await fs.access(pythonScript);
        } catch (error) {
            return res.status(500).json({ 
                error: 'Analytics generator not found',
                details: 'Python analytics script is not available'
            });
        }

        // Prepare user data as JSON string
        const userDataJson = JSON.stringify(userData);

        // Execute Python script
        const pythonProcess = spawn('python', [pythonScript, userDataJson], {
            cwd: process.cwd(),
            stdio: ['pipe', 'pipe', 'pipe']
        });

        let stdout = '';
        let stderr = '';

        pythonProcess.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        pythonProcess.on('close', async (code) => {
            if (code !== 0) {
                console.error('Python script error:', stderr);
                return res.status(500).json({ 
                    error: 'Analytics generation failed',
                    details: stderr || 'Unknown error occurred'
                });
            }

            try {
                // Parse the result from Python script
                const result = JSON.parse(stdout.trim());
                
                if (result.success) {
                    // Read generated chart files and convert to base64
                    const chartData = {};
                    
                    for (const filename of result.generated_files) {
                        try {
                            const filePath = path.join(result.output_directory, filename);
                            const fileBuffer = await fs.readFile(filePath);
                            const base64Data = fileBuffer.toString('base64');
                            chartData[filename] = `data:image/png;base64,${base64Data}`;
                            
                            // Clean up the file after reading
                            await fs.unlink(filePath).catch(() => {});
                        } catch (fileError) {
                            console.error(`Error reading chart file ${filename}:`, fileError);
                        }
                    }

                    res.status(200).json({
                        success: true,
                        charts: chartData,
                        generated_files: result.generated_files
                    });
                } else {
                    res.status(500).json({
                        error: 'Analytics generation failed',
                        details: result.error
                    });
                }
            } catch (parseError) {
                console.error('Error parsing Python script output:', parseError);
                console.error('Raw output:', stdout);
                res.status(500).json({
                    error: 'Failed to parse analytics results',
                    details: parseError.message
                });
            }
        });

        // Set timeout for Python script execution
        setTimeout(() => {
            pythonProcess.kill('SIGTERM');
            res.status(408).json({
                error: 'Analytics generation timeout',
                details: 'Chart generation took too long'
            });
        }, 30000); // 30 second timeout

    } catch (error) {
        console.error('Python analytics API error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }

        res.status(500).json({ 
            error: 'Server error',
            details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};