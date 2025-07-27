const jwt = require('jsonwebtoken');
const { sql } = require('@vercel/postgres');

// Verify JWT token
const verifyToken = (req) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        throw new Error('No token provided');
    }
    return jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key');
};

// Grade point mapping
const gradePoints = { S: 10, A: 9, B: 8, C: 7, D: 6, E: 4 };

// Calculate comprehensive user analytics
async function getUserAnalytics(userId) {
    try {
        // Get current user data
        const userDataResult = await sql`
            SELECT course_data, target_cgpa 
            FROM user_data 
            WHERE user_id = ${userId}
        `;

        if (userDataResult.rows.length === 0) {
            return null;
        }

        const courseData = userDataResult.rows[0].course_data;
        const targetCGPA = userDataResult.rows[0].target_cgpa;

        // Calculate current CGPA and stats
        const currentStats = calculateCourseStats(courseData);

        // Get CGPA history for trend analysis
        const cgpaHistoryResult = await sql`
            SELECT cgpa, total_credits, recorded_at
            FROM cgpa_history 
            WHERE user_id = ${userId}
            ORDER BY recorded_at ASC
        `;

        // Get study session analytics
        const studyStatsResult = await sql`
            SELECT 
                COUNT(*) as total_sessions,
                COUNT(CASE WHEN session_type = 'study' THEN 1 END) as study_sessions,
                SUM(CASE WHEN session_type = 'study' AND was_completed = true THEN duration_seconds ELSE 0 END) as total_study_seconds,
                COUNT(DISTINCT course_code) as courses_studied,
                COUNT(CASE WHEN session_type = 'study' AND was_completed = true AND DATE(completed_at) >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as sessions_this_week,
                COUNT(CASE WHEN session_type = 'study' AND was_completed = true AND DATE(completed_at) = CURRENT_DATE THEN 1 END) as sessions_today
            FROM study_sessions 
            WHERE user_id = ${userId}
        `;

        // Get popular study courses
        const popularCoursesResult = await sql`
            SELECT 
                course_code,
                COUNT(*) as session_count,
                SUM(duration_seconds) as total_duration
            FROM study_sessions 
            WHERE user_id = ${userId} 
            AND session_type = 'study' 
            AND was_completed = true
            AND course_code IS NOT NULL
            GROUP BY course_code
            ORDER BY session_count DESC
            LIMIT 5
        `;

        // Calculate study streak
        const streakResult = await sql`
            WITH daily_sessions AS (
                SELECT DISTINCT DATE(completed_at) as session_date
                FROM study_sessions 
                WHERE user_id = ${userId} 
                AND session_type = 'study' 
                AND was_completed = true
                ORDER BY session_date DESC
            ),
            consecutive_days AS (
                SELECT 
                    session_date,
                    session_date - INTERVAL '1 day' * ROW_NUMBER() OVER (ORDER BY session_date DESC) as group_date
                FROM daily_sessions
            )
            SELECT COUNT(*) as streak_days
            FROM consecutive_days
            WHERE group_date = (
                SELECT group_date 
                FROM consecutive_days 
                ORDER BY session_date DESC 
                LIMIT 1
            )
        `;

        // Get recent activity
        const recentActivityResult = await sql`
            SELECT 
                session_type,
                course_code,
                activity_description,
                duration_seconds,
                completed_at
            FROM study_sessions 
            WHERE user_id = ${userId}
            ORDER BY completed_at DESC
            LIMIT 10
        `;

        const studyStats = studyStatsResult.rows[0];
        const streak = streakResult.rows[0]?.streak_days || 0;

        return {
            academic: {
                currentCGPA: currentStats.cgpa,
                totalCredits: currentStats.totalCredits,
                completedCourses: currentStats.completedCourses,
                gradeDistribution: currentStats.gradeDistribution,
                targetCGPA: targetCGPA,
                creditsToGo: Math.max(0, 142 - currentStats.totalCredits),
                progressPercentage: Math.min(100, (currentStats.totalCredits / 142) * 100)
            },
            trends: {
                cgpaHistory: cgpaHistoryResult.rows.map(row => ({
                    cgpa: parseFloat(row.cgpa),
                    credits: row.total_credits,
                    date: row.recorded_at
                })),
                cgpaTrend: calculateCGPATrend(cgpaHistoryResult.rows)
            },
            study: {
                totalSessions: parseInt(studyStats.total_sessions),
                studySessions: parseInt(studyStats.study_sessions),
                totalStudyHours: studyStats.total_study_seconds ? (studyStats.total_study_seconds / 3600).toFixed(1) : '0',
                coursesStudied: parseInt(studyStats.courses_studied),
                sessionsThisWeek: parseInt(studyStats.sessions_this_week),
                sessionsToday: parseInt(studyStats.sessions_today),
                currentStreak: parseInt(streak),
                popularCourses: popularCoursesResult.rows.map(row => ({
                    courseCode: row.course_code,
                    sessionCount: parseInt(row.session_count),
                    totalHours: (row.total_duration / 3600).toFixed(1)
                }))
            },
            activity: {
                recent: recentActivityResult.rows.map(row => ({
                    type: row.session_type,
                    courseCode: row.course_code,
                    activity: row.activity_description,
                    duration: Math.round(row.duration_seconds / 60),
                    completedAt: row.completed_at
                }))
            }
        };

    } catch (error) {
        console.error('Error calculating user analytics:', error);
        throw error;
    }
}

// Calculate academic statistics from course data
function calculateCourseStats(courseData) {
    let totalPoints = 0;
    let totalCredits = 0;
    let completedCourses = 0;
    const gradeDistribution = { S: 0, A: 0, B: 0, C: 0, D: 0, E: 0 };

    if (!courseData || !courseData.courses) {
        return {
            cgpa: 0,
            totalCredits: 0,
            completedCourses: 0,
            gradeDistribution
        };
    }

    Object.entries(courseData.courses).forEach(([courseId, data]) => {
        if (data.grade && gradePoints[data.grade]) {
            const credits = getCreditsForCourse(courseId);
            totalPoints += gradePoints[data.grade] * credits;
            totalCredits += credits;
            completedCourses++;
            gradeDistribution[data.grade]++;
        }
    });

    const cgpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;

    return {
        cgpa: parseFloat(cgpa.toFixed(2)),
        totalCredits,
        completedCourses,
        gradeDistribution
    };
}

// Get credits for a course based on course ID
function getCreditsForCourse(courseId) {
    const [section, index] = courseId.split('-');
    
    // Credit mappings based on course structure
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
            'opt-project': 2,
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

// Calculate CGPA trend (improving, declining, stable)
function calculateCGPATrend(cgpaHistory) {
    if (cgpaHistory.length < 2) return 'insufficient_data';

    const recent = cgpaHistory.slice(-3); // Last 3 entries
    if (recent.length < 2) return 'insufficient_data';

    const firstCGPA = parseFloat(recent[0].cgpa);
    const lastCGPA = parseFloat(recent[recent.length - 1].cgpa);
    const difference = lastCGPA - firstCGPA;

    if (Math.abs(difference) < 0.05) return 'stable';
    return difference > 0 ? 'improving' : 'declining';
}

// Calculate target CGPA feasibility
function calculateTargetFeasibility(currentStats, targetCGPA) {
    const remainingCredits = 142 - currentStats.totalCredits;
    
    if (remainingCredits <= 0) {
        return {
            feasible: true,
            message: 'All credits completed',
            requiredGrade: null
        };
    }

    const requiredTotalPoints = targetCGPA * (currentStats.totalCredits + remainingCredits);
    const currentTotalPoints = currentStats.cgpa * currentStats.totalCredits;
    const requiredNewPoints = requiredTotalPoints - currentTotalPoints;
    const requiredAvgGrade = requiredNewPoints / remainingCredits;

    const feasible = requiredAvgGrade >= 0 && requiredAvgGrade <= 10;

    return {
        feasible,
        requiredAverageGrade: requiredAvgGrade,
        remainingCredits,
        message: feasible ? 
            `Need to maintain an average grade of ${requiredAvgGrade.toFixed(2)} in remaining courses` :
            'Target CGPA is not achievable with remaining credits'
    };
}

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
        const decoded = verifyToken(req);
        const analytics = await getUserAnalytics(decoded.userId);

        if (!analytics) {
            return res.status(404).json({ message: 'User data not found' });
        }

        // Add target CGPA analysis if target is set
        if (analytics.academic.targetCGPA) {
            analytics.target = calculateTargetFeasibility(
                {
                    cgpa: analytics.academic.currentCGPA,
                    totalCredits: analytics.academic.totalCredits
                },
                analytics.academic.targetCGPA
            );
        }

        res.status(200).json({
            analytics,
            generatedAt: new Date().toISOString()
        });

    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.message === 'No token provided') {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        console.error('Analytics dashboard error:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};