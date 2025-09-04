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

// Grade point mapping
const gradePoints = { S: 10, A: 9, B: 8, C: 7, D: 6, E: 4 };

// Calculate CGPA and credits from course data
function calculateStats(courseData) {
    let totalPoints = 0;
    let totalCredits = 0;
    const gradeCounts = { S: 0, A: 0, B: 0, C: 0, D: 0, E: 0 };

    if (!courseData.courses) return { cgpa: 0, totalCredits: 0, gradeCounts };

    Object.entries(courseData.courses).forEach(([courseId, data]) => {
        if (data.grade && gradePoints[data.grade]) {
            const credits = getCreditsForCourse(courseId, data);
            totalPoints += gradePoints[data.grade] * credits;
            totalCredits += credits;
            gradeCounts[data.grade]++;
        }
    });

    const cgpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
    return { cgpa, totalCredits, totalPoints, gradeCounts };
}

// Get credits for a specific course
function getCreditsForCourse(courseId, courseData) {
    const [section, index] = courseId.split('-');
    
    // Credit mapping based on course structure
    const creditMap = {
        foundation: 4,
        programming: {
            '3': 2, // MAD I Project
            '6': 2, // MAD II Project  
            '7': 3, // System Commands
            default: 4
        },
        dataScience: {
            '4': 2, // ML Practice Project
            '5': 3, // Tools in Data Science
            'opt-analytics': 4,
            'opt-dl': 4,
            'opt-analytics-project': 2,
            'opt-dl-project': 2,
            default: 4
        },
        degreeCore: 4,
        elective: 4
    };

    if (section === 'programming') {
        return creditMap.programming[index] || creditMap.programming.default;
    } else if (section === 'dataScience') {
        return creditMap.dataScience[index] || creditMap.dataScience.default;
    } else {
        return creditMap[section] || 4;
    }
}

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const decoded = verifyToken(req);
        const userId = decoded.userId;

        if (req.method === 'GET') {
            // Get user data
            const result = await sql`
                SELECT course_data, target_cgpa, timer_settings, updated_at
                FROM user_data 
                WHERE user_id = ${userId}
            `;

            if (result.rows.length === 0) {
                // Create default user data if none exists
                await sql`
                    INSERT INTO user_data (user_id, course_data, target_cgpa, timer_settings)
                    VALUES (${userId}, '{"courses": {}, "electives": [], "dataScienceOptions": {"analytics": true, "project": true}}', NULL, '{"studyDuration": 1500, "breakDuration": 300}')
                `;

                return res.status(200).json({
                    userData: {
                        courses: {},
                        electives: [],
                        dataScienceOptions: { analytics: true, project: true },
                        targetCGPA: null,
                        cgpaHistory: []
                    },
                    timerSettings: { studyDuration: 1500, breakDuration: 300 }
                });
            }

            const userData = result.rows[0];
            
            // Get CGPA history
            const historyResult = await sql`
                SELECT cgpa, total_credits, recorded_at
                FROM cgpa_history 
                WHERE user_id = ${userId}
                ORDER BY recorded_at DESC
                LIMIT 20
            `;

            const cgpaHistory = historyResult.rows.map(row => ({
                cgpa: parseFloat(row.cgpa || 0).toFixed(2),
                credits: parseInt(row.total_credits || 0),
                timestamp: row.recorded_at
            }));

            // Ensure proper data structure
            let courseData = {};
            try {
                courseData = typeof userData.course_data === 'string' ? 
                    JSON.parse(userData.course_data) : 
                    (userData.course_data || {});
            } catch (e) {
                console.error('Error parsing course_data:', e);
                courseData = {};
            }
            
            res.status(200).json({
                userData: {
                    courses: courseData.courses || {},
                    electives: courseData.electives || [],
                    dataScienceOptions: courseData.dataScienceOptions || { analytics: true, project: true },
                    targetCGPA: userData.target_cgpa,
                    cgpaHistory
                },
                timerSettings: userData.timer_settings || { studyDuration: 1500, breakDuration: 300 }
            });

        } else if (req.method === 'POST') {
            // Save user data
            const { userData, timerSettings } = req.body;

            if (!userData) {
                return res.status(400).json({ message: 'User data is required' });
            }

            // Calculate current stats for CGPA history
            const stats = calculateStats(userData);

            // Update user data
            await sql`
                INSERT INTO user_data (user_id, course_data, target_cgpa, timer_settings, updated_at)
                VALUES (${userId}, ${JSON.stringify(userData)}, ${userData.targetCGPA || null}, ${JSON.stringify(timerSettings || { studyDuration: 1500, breakDuration: 300 })}, NOW())
                ON CONFLICT (user_id) 
                DO UPDATE SET 
                    course_data = EXCLUDED.course_data,
                    target_cgpa = EXCLUDED.target_cgpa,
                    timer_settings = EXCLUDED.timer_settings,
                    updated_at = EXCLUDED.updated_at
            `;

            // Record CGPA history if there are completed courses
            if (stats.totalCredits > 0) {
                // Check if we should add a new history entry
                const lastEntry = await sql`
                    SELECT cgpa, total_credits, recorded_at
                    FROM cgpa_history 
                    WHERE user_id = ${userId}
                    ORDER BY recorded_at DESC
                    LIMIT 1
                `;

                const shouldAddEntry = lastEntry.rows.length === 0 || 
                    Math.abs(parseFloat(lastEntry.rows[0].cgpa) - stats.cgpa) > 0.01 ||
                    lastEntry.rows[0].total_credits !== stats.totalCredits ||
                    new Date() - new Date(lastEntry.rows[0].recorded_at) > 3600000; // 1 hour

                if (shouldAddEntry) {
                    await sql`
                        INSERT INTO cgpa_history (user_id, cgpa, total_credits, grade_points)
                        VALUES (${userId}, ${stats.cgpa.toFixed(2)}, ${stats.totalCredits}, ${stats.totalPoints.toFixed(2)})
                    `;
                }
            }

            res.status(200).json({ 
                message: 'Data saved successfully',
                stats: {
                    cgpa: stats.cgpa.toFixed(2),
                    totalCredits: stats.totalCredits,
                    gradeCounts: stats.gradeCounts
                }
            });

        } else {
            res.status(405).json({ message: 'Method not allowed' });
        }

    } catch (error) {
        console.error('User data API error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }

        res.status(500).json({ 
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};