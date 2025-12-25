const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
            const { data: result, error } = await supabase
                .from('user_data')
                .select('course_data, target_cgpa, timer_settings, updated_at')
                .eq('user_id', userId);

            const userData = result && result.length > 0 ? result[0] : null;

            if (error || !userData) {
                // Create default user data if none exists
                await supabase
                    .from('user_data')
                    .insert({
                        user_id: userId,
                        course_data: { courses: {}, electives: [] },
                        target_cgpa: null,
                        timer_settings: { studyDuration: 1500, breakDuration: 300 }
                    });

                return res.status(200).json({
                    success: true,
                    userData: {
                        courses: {},
                        electives: [],
                        targetCGPA: null,
                        cgpaHistory: []
                    },
                    timerSettings: { studyDuration: 1500, breakDuration: 300 }
                });
            }

            // userData already defined above

            // Get CGPA history
            const { data: historyResult } = await supabase
                .from('cgpa_history')
                .select('cgpa, total_credits, recorded_at')
                .eq('user_id', userId)
                .order('recorded_at', { ascending: false })
                .limit(20);

            const cgpaHistory = (historyResult || []).map(row => ({
                cgpa: parseFloat(row.cgpa || 0).toFixed(2),
                credits: parseInt(row.total_credits || 0),
                timestamp: row.recorded_at
            }));

            // Parse and validate course data
            let courseData = {};
            try {
                if (userData.course_data) {
                    courseData = typeof userData.course_data === 'string' ?
                        JSON.parse(userData.course_data) : userData.course_data;
                }
            } catch (e) {
                console.error('Error parsing course_data:', e);
                courseData = { courses: {}, electives: [] };
            }

            // Ensure all required fields exist
            const responseData = {
                courses: courseData.courses || {},
                electives: courseData.electives || [],
                targetCGPA: userData.target_cgpa || null,
                cgpaHistory: cgpaHistory || []
            };

            res.status(200).json({
                success: true,
                userData: responseData,
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

            // Update user data with calculated CGPA
            await supabase
                .from('user_data')
                .upsert({
                    user_id: userId,
                    course_data: userData,
                    current_cgpa: stats.totalCredits > 0 ? parseFloat(stats.cgpa.toFixed(2)) : null,
                    total_credits: stats.totalCredits,
                    target_cgpa: userData.targetCGPA || null,
                    timer_settings: timerSettings || { studyDuration: 1500, breakDuration: 300 },
                    updated_at: new Date().toISOString()
                });

            // Record CGPA history if there are completed courses (and data changed)
            if (stats.totalCredits > 0) {
                // Get latest entry
                const { data: lastEntries } = await supabase
                    .from('cgpa_history')
                    .select('id, cgpa, total_credits, recorded_at')
                    .eq('user_id', userId)
                    .order('recorded_at', { ascending: false })
                    .limit(1);

                const lastEntry = lastEntries && lastEntries.length > 0 ? lastEntries[0] : null;

                // Check if we should update the last entry (if it's from today) or create new one
                const today = new Date().toDateString();
                const lastEntryDate = lastEntry ? new Date(lastEntry.recorded_at).toDateString() : null;

                if (lastEntry && lastEntryDate === today) {
                    // Update existing entry for today
                    if (parseFloat(lastEntry.cgpa) !== parseFloat(stats.cgpa.toFixed(2)) || lastEntry.total_credits !== stats.total_credits) {
                        const { error: updateError } = await supabase
                            .from('cgpa_history')
                            .update({
                                cgpa: parseFloat(stats.cgpa.toFixed(2)),
                                total_credits: stats.totalCredits,
                                grade_points: parseFloat(stats.totalPoints.toFixed(2)),
                                recorded_at: new Date().toISOString() // Update timestamp
                            })
                            .eq('id', lastEntry.id);

                        if (updateError) console.error('CGPA history update error:', updateError);
                    }
                } else {
                    // Create new entry if no entry today or significant change logic (optional, but daily snapshot is good)
                    // We only insert if there is a CHANGE from previous, OR if it's a new day.
                    // But if it's a new day, we only want to insert if there was a change or just to have a data point?
                    // Let's stick to: New Day = New Entry (if data exists), Same Day = Update Entry.
                    // This keeps history clean (1 per day max).

                    const shouldInsert = !lastEntry || lastEntryDate !== today;

                    if (shouldInsert) {
                        const { error: insertError } = await supabase
                            .from('cgpa_history')
                            .insert({
                                user_id: userId,
                                cgpa: parseFloat(stats.cgpa.toFixed(2)),
                                total_credits: stats.totalCredits,
                                grade_points: parseFloat(stats.totalPoints.toFixed(2)),
                                recorded_at: new Date().toISOString()
                            });

                        if (insertError) console.error('CGPA history insert error:', insertError);
                    }
                }
            }

            res.status(200).json({
                success: true,
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