const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const verifyToken = (req) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new Error('No token provided');
    return jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key');
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
        const { data: result } = await supabase
            .from('user_data')
            .select('course_data')
            .eq('user_id', decoded.userId);

        const courseData = (result && result.length > 0) ? result[0].course_data : { courses: {}, electives: [] };
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

    Object.entries(courseData.courses || {}).forEach(([courseId, course]) => {
        if (course.grade && gradePoints[course.grade]) {
            const credits = getCreditsForCourse(courseId);
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

function getCreditsForCourse(courseId) {
    const [section, index] = courseId.split('-');
    
    // Special cases for different credit values
    if (section === 'dataScience' && index === 'opt-project') return 2;
    if (section === 'programming' && ['3', '6'].includes(index)) return 2;
    if (section === 'programming' && index === '7') return 3;
    if (section === 'dataScience' && ['2', '4'].includes(index)) return 2;
    if (section === 'dataScience' && index === '5') return 3;
    
    return 4; // Default credits
}

function generateGradeRecommendations(requiredAvg, credits) {
    const recommendations = [];
    const coursesNeeded = Math.ceil(credits / 4); // Assuming most courses are 4 credits
    
    // Generate different combinations
    for (let sCount = 0; sCount <= coursesNeeded; sCount++) {
        for (let aCount = 0; aCount <= coursesNeeded - sCount; aCount++) {
            for (let bCount = 0; bCount <= coursesNeeded - sCount - aCount; bCount++) {
                const cCount = coursesNeeded - sCount - aCount - bCount;
                
                if (cCount >= 0) {
                    const totalPoints = sCount * 40 + aCount * 36 + bCount * 32 + cCount * 28;
                    const avg = totalPoints / (coursesNeeded * 4);
                    
                    if (Math.abs(avg - requiredAvg) < 0.5) {
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

    // Sort by closest to required average and return top 5
    return recommendations
        .sort((a, b) => Math.abs(a.averageGrade - requiredAvg) - Math.abs(b.averageGrade - requiredAvg))
        .slice(0, 5);
}