const jwt = require('jsonwebtoken');
const { Pool } = require('@vercel/postgres');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
});

const verifyToken = (req) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new Error('No token provided');
    return jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key');
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
        const courseData = user.course_data || { courses: {}, electives: [], dataScienceOptions: { analytics: true, project: true } };

        if (format === 'json') {
            // Return JSON format
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename="studymetrics_${user.username}_${new Date().toISOString().split('T')[0]}.json"`);
            
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
            res.setHeader('Content-Disposition', `attachment; filename="studymetrics_${user.username}_${new Date().toISOString().split('T')[0]}.csv"`);
            
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

    Object.entries(courseData.courses || {}).forEach(([courseId, course]) => {
        if (course.grade && gradePoints[course.grade]) {
            const credits = getCreditsForCourse(courseId, courseData);
            totalPoints += gradePoints[course.grade] * credits;
            totalCredits += credits;
            gradeDistribution[course.grade]++;
        }
    });

    return {
        cgpa: totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00',
        totalCredits,
        completedCourses: Object.keys(courseData.courses || {}).filter(id => courseData.courses[id].grade).length,
        gradeDistribution
    };
}

function getCreditsForCourse(courseId, courseData) {
    const [section, index] = courseId.split('-');
    
    // Default credits mapping
    const creditMap = {
        'foundation': 4,
        'programming': 4,
        'dataScience': 4,
        'degreeCore': 4,
        'elective': 4
    };
    
    // Special cases
    if (section === 'dataScience' && index === 'opt-project') return 2;
    if (section === 'programming' && ['3', '6'].includes(index)) return 2; // Project courses
    if (section === 'programming' && index === '7') return 3; // System Commands
    if (section === 'dataScience' && ['2', '4'].includes(index)) return 2; // Project courses
    if (section === 'dataScience' && index === '5') return 3; // Tools in Data Science
    
    return creditMap[section] || 4;
}

function generateCSV(username, courseData) {
    const headers = ['Course ID', 'Section', 'Grade', 'Credits', 'Grade Points'];
    const rows = [headers.join(',')];
    const gradePoints = { S: 10, A: 9, B: 8, C: 7, D: 6, E: 4 };
    
    // Add course data
    Object.entries(courseData.courses || {}).forEach(([courseId, data]) => {
        if (data.grade) {
            const [section] = courseId.split('-');
            const credits = getCreditsForCourse(courseId, courseData);
            const row = [
                courseId,
                section,
                data.grade,
                credits,
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
    rows.push(`Completed Courses,${summary.completedCourses}`);
    
    return rows.join('\n');
}