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

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const decoded = verifyToken(req);

        if (req.method === 'GET') {
            // Get study session history
            const { limit = 20, offset = 0, type } = req.query;
            
            let query = sql`
                SELECT 
                    id,
                    session_type,
                    duration_seconds,
                    course_code,
                    activity_description,
                    started_at,
                    completed_at,
                    was_completed,
                    metadata
                FROM study_sessions 
                WHERE user_id = ${decoded.userId}
            `;

            if (type && ['study', 'break'].includes(type)) {
                query = sql`
                    SELECT 
                        id,
                        session_type,
                        duration_seconds,
                        course_code,
                        activity_description,
                        started_at,
                        completed_at,
                        was_completed,
                        metadata
                    FROM study_sessions 
                    WHERE user_id = ${decoded.userId} 
                    AND session_type = ${type}
                `;
            }

            const result = await sql`
                ${query}
                ORDER BY completed_at DESC 
                LIMIT ${parseInt(limit)} 
                OFFSET ${parseInt(offset)}
            `;

            // Get study statistics
            const statsResult = await sql`
                SELECT 
                    COUNT(*) as total_sessions,
                    COUNT(CASE WHEN session_type = 'study' THEN 1 END) as study_sessions,
                    COUNT(CASE WHEN session_type = 'break' THEN 1 END) as break_sessions,
                    SUM(CASE WHEN session_type = 'study' AND was_completed = true THEN duration_seconds ELSE 0 END) as total_study_seconds,
                    AVG(CASE WHEN session_type = 'study' AND was_completed = true THEN duration_seconds ELSE NULL END) as avg_study_duration,
                    COUNT(CASE WHEN session_type = 'study' AND was_completed = true AND DATE(completed_at) = CURRENT_DATE THEN 1 END) as today_study_sessions
                FROM study_sessions 
                WHERE user_id = ${decoded.userId}
            `;

            // Get study streak
            const streakResult = await sql`
                WITH daily_sessions AS (
                    SELECT DISTINCT DATE(completed_at) as session_date
                    FROM study_sessions 
                    WHERE user_id = ${decoded.userId} 
                    AND session_type = 'study' 
                    AND was_completed = true
                    ORDER BY session_date DESC
                ),
                streak_calculation AS (
                    SELECT 
                        session_date,
                        ROW_NUMBER() OVER (ORDER BY session_date DESC) as rn,
                        session_date - INTERVAL '1 day' * (ROW_NUMBER() OVER (ORDER BY session_date DESC) - 1) as expected_date
                    FROM daily_sessions
                )
                SELECT COUNT(*) as streak_days
                FROM streak_calculation
                WHERE expected_date = CURRENT_DATE - INTERVAL '1 day' * (rn - 1)
            `;

            const stats = statsResult.rows[0];
            const streak = streakResult.rows[0]?.streak_days || 0;

            res.status(200).json({
                sessions: result.rows,
                statistics: {
                    totalSessions: parseInt(stats.total_sessions),
                    studySessions: parseInt(stats.study_sessions),
                    breakSessions: parseInt(stats.break_sessions),
                    totalStudyHours: stats.total_study_seconds ? (stats.total_study_seconds / 3600).toFixed(1) : '0',
                    averageStudyDuration: stats.avg_study_duration ? Math.round(stats.avg_study_duration / 60) : 0,
                    todayStudySessions: parseInt(stats.today_study_sessions),
                    currentStreak: parseInt(streak)
                },
                pagination: {
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    total: parseInt(stats.total_sessions)
                }
            });

        } else if (req.method === 'POST') {
            // Create a new study session
            const {
                sessionType,
                durationSeconds,
                courseCode,
                activityDescription,
                startedAt,
                metadata = {}
            } = req.body;

            // Validate input
            if (!sessionType || !['study', 'break'].includes(sessionType)) {
                return res.status(400).json({ message: 'Invalid session type' });
            }

            if (!durationSeconds || durationSeconds < 60 || durationSeconds > 7200) { // 1 min to 2 hours
                return res.status(400).json({ message: 'Invalid duration' });
            }

            const startTime = startedAt ? new Date(startedAt) : new Date();

            const result = await sql`
                INSERT INTO study_sessions (
                    user_id, 
                    session_type, 
                    duration_seconds, 
                    course_code, 
                    activity_description, 
                    started_at,
                    completed_at,
                    was_completed,
                    metadata
                ) VALUES (
                    ${decoded.userId},
                    ${sessionType},
                    ${durationSeconds},
                    ${courseCode || null},
                    ${activityDescription || null},
                    ${startTime.toISOString()},
                    NOW(),
                    true,
                    ${JSON.stringify(metadata)}
                )
                RETURNING id, started_at, completed_at
            `;

            const session = result.rows[0];

            res.status(201).json({
                message: 'Study session recorded successfully',
                session: {
                    id: session.id,
                    sessionType,
                    durationSeconds,
                    courseCode,
                    activityDescription,
                    startedAt: session.started_at,
                    completedAt: session.completed_at
                }
            });

        } else if (req.method === 'PUT') {
            // Update an existing session (e.g., mark as incomplete)
            const { sessionId } = req.query;
            const { wasCompleted, metadata } = req.body;

            if (!sessionId) {
                return res.status(400).json({ message: 'Session ID required' });
            }

            const result = await sql`
                UPDATE study_sessions 
                SET 
                    was_completed = ${wasCompleted !== undefined ? wasCompleted : true},
                    metadata = ${metadata ? JSON.stringify(metadata) : metadata},
                    completed_at = NOW()
                WHERE id = ${sessionId} AND user_id = ${decoded.userId}
                RETURNING id
            `;

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Session not found' });
            }

            res.status(200).json({ message: 'Session updated successfully' });

        } else if (req.method === 'DELETE') {
            // Delete a session
            const { sessionId } = req.query;

            if (!sessionId) {
                return res.status(400).json({ message: 'Session ID required' });
            }

            const result = await sql`
                DELETE FROM study_sessions 
                WHERE id = ${sessionId} AND user_id = ${decoded.userId}
                RETURNING id
            `;

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Session not found' });
            }

            res.status(200).json({ message: 'Session deleted successfully' });

        } else {
            res.status(405).json({ message: 'Method not allowed' });
        }

    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.message === 'No token provided') {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        console.error('Timer sessions error:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};