// api/analytics/export.js - Export user data as PDF/JSON
const jwt = require('jsonwebtoken');
const { Pool } = require('@vercel/postgres');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
});

const verifyToken = (req) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new Error('No token provided');
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const decoded = verifyToken(req);
        const { format = 'json' } = req.query;

        // Get user data
        const userResult = await pool.query(
            'SELECT u.username, u.created_at, ud.course_data FROM users u LEFT JOIN user_data ud ON u.id = ud.user_id WHERE u.id = $1',
            [decoded.userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = userResult.rows[0];
        const courseData = user.course_data || { courses: {}, electives: [] };

        if (format === 'json') {
            // Return JSON format
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename="iitmbs_cgpa_${user.username}_${new Date().toISOString().split('T')[0]}.json"`);
            
            res.status(200).json({
                username: user.username,
                exportDate: new Date().toISOString(),
                accountCreated: user.created_at,
                courseData: courseData,
                summary: calculateSummary(courseData)
            });
        } else if (format === 'csv') {
            // Return CSV format
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="iitmbs_cgpa_${user.username}_${new Date().toISOString().split('T')[0]}.csv"`);
            
            const csv = generateCSV(user.username, courseData);
            res.status(200).send(csv);
        } else {
            res.status(400).json({ message: 'Invalid format. Use json or csv' });
        }
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

function calculateSummary(courseData) {
    const gradePoints = { S: 10, A: 9, B: 8, C: 7, D: 6, E: 4 };
    let totalPoints = 0;
    let totalCredits = 0;
    let gradeDistribution = { S: 0, A: 0, B: 0, C: 0, D: 0, E: 0 };

    Object.values(courseData.courses).forEach(course => {
        if (course.grade && gradePoints[course.grade]) {
            const credits = course.credits || 4;
            totalPoints += gradePoints[course.grade] * credits;
            totalCredits += credits;
            gradeDistribution[course.grade]++;
        }
    });

    return {
        cgpa: totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00',
        totalCredits,
        completedCourses: Object.keys(courseData.courses).filter(id => courseData.courses[id].grade).length,
        gradeDistribution
    };
}

function generateCSV(username, courseData) {
    const headers = ['Course ID', 'Course Name', 'Credits', 'Grade', 'Grade Points'];
    const rows = [headers.join(',')];
    
    // Add course data
    Object.entries(courseData.courses).forEach(([courseId, data]) => {
        if (data.grade) {
            const row = [
                courseId,
                data.name || '',
                data.credits || 4,
                data.grade,
                gradePoints[data.grade] || 0
            ];
            rows.push(row.map(cell => `"${cell}"`).join(','));
        }
    });
    
    // Add summary
    const summary = calculateSummary(courseData);
    rows.push('');
    rows.push('Summary');
    rows.push(`CGPA,${summary.cgpa}`);
    rows.push(`Total Credits,${summary.totalCredits}`);
    
    return rows.join('\n');
}

// api/analytics/statistics.js - Get program-wide statistics
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
        const stats = await pool.query(`
            SELECT 
                COUNT(DISTINCT u.id) as total_users,
                COUNT(DISTINCT CASE WHEN u.last_login > NOW() - INTERVAL '30 days' THEN u.id END) as active_users,
                AVG(CASE 
                    WHEN ud.course_data->>'courses' != '{}' 
                    THEN (
                        SELECT COUNT(*) 
                        FROM jsonb_object_keys(ud.course_data->'courses') 
                        WHERE (ud.course_data->'courses'->jsonb_object_keys(ud.course_data->'courses')->>'grade') IS NOT NULL
                    )
                    ELSE 0 
                END) as avg_completed_courses
            FROM users u
            LEFT JOIN user_data ud ON u.id = ud.user_id
            WHERE u.is_active = true
        `);

        res.status(200).json({
            statistics: stats.rows[0],
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error('Statistics error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// api/analytics/target-cgpa.js - Calculate required grades for target CGPA
const jwt = require('jsonwebtoken');
const { Pool } = require('@vercel/postgres');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
});

const verifyToken = (req) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new Error('No token provided');
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const decoded = verifyToken(req);
        const { targetCGPA, remainingCredits } = req.body;

        if (!targetCGPA || targetCGPA < 0 || targetCGPA > 10) {
            return res.status(400).json({ message: 'Invalid target CGPA' });
        }

        // Get current user data
        const result = await pool.query(
            'SELECT course_data FROM user_data WHERE user_id = $1',
            [decoded.userId]
        );

        const courseData = result.rows[0]?.course_data || { courses: {}, electives: [] };
        const currentStats = calculateCurrentStats(courseData);
        
        // Calculate required grade points
        const requiredTotalPoints = targetCGPA * (currentStats.completedCredits + remainingCredits);
        const requiredNewPoints = requiredTotalPoints - currentStats.totalPoints;
        const requiredAvgGrade = requiredNewPoints / remainingCredits;

        // Generate recommendations
        const recommendations = generateGradeRecommendations(requiredAvgGrade, remainingCredits);

        res.status(200).json({
            currentCGPA: currentStats.cgpa,
            currentCredits: currentStats.completedCredits,
            targetCGPA,
            remainingCredits,
            requiredAverageGrade: requiredAvgGrade.toFixed(2),
            recommendations,
            feasible: requiredAvgGrade <= 10 && requiredAvgGrade >= 0
        });
    } catch (error) {
        console.error('Target CGPA error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

function calculateCurrentStats(courseData) {
    const gradePoints = { S: 10, A: 9, B: 8, C: 7, D: 6, E: 4 };
    let totalPoints = 0;
    let completedCredits = 0;

    Object.values(courseData.courses).forEach(course => {
        if (course.grade && gradePoints[course.grade]) {
            const credits = course.credits || 4;
            totalPoints += gradePoints[course.grade] * credits;
            completedCredits += credits;
        }
    });

    return {
        totalPoints,
        completedCredits,
        cgpa: completedCredits > 0 ? (totalPoints / completedCredits).toFixed(2) : '0.00'
    };
}

function generateGradeRecommendations(requiredAvg, credits) {
    const recommendations = [];
    const gradeOptions = [
        { grade: 'S', points: 10 },
        { grade: 'A', points: 9 },
        { grade: 'B', points: 8 },
        { grade: 'C', points: 7 }
    ];

    // Find combinations that achieve the required average
    for (let sCount = 0; sCount <= credits / 4; sCount++) {
        for (let aCount = 0; aCount <= (credits - sCount * 4) / 4; aCount++) {
            for (let bCount = 0; bCount <= (credits - sCount * 4 - aCount * 4) / 4; bCount++) {
                const remainingCredits = credits - (sCount + aCount + bCount) * 4;
                if (remainingCredits >= 0 && remainingCredits % 4 === 0) {
                    const cCount = remainingCredits / 4;
                    const totalPoints = sCount * 40 + aCount * 36 + bCount * 32 + cCount * 28;
                    const avg = totalPoints / credits;
                    
                    if (Math.abs(avg - requiredAvg) < 0.1) {
                        recommendations.push({
                            S: sCount,
                            A: aCount,
                            B: bCount,
                            C: cCount,
                            averageGrade: avg.toFixed(2)
                        });
                    }
                }
            }
        }
    }

    return recommendations.slice(0, 5); // Return top 5 recommendations
}