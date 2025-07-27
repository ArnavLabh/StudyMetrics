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