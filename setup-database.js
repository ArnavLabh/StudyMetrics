const { sql } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    try {
        console.log('🚀 Starting database setup...');
        
        // Check if we need to migrate existing data
        const existingUsersCheck = await sql`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'users'
            );
        `;
        
        const hasExistingUsers = existingUsersCheck.rows[0].exists;
        
        if (hasExistingUsers) {
            console.log('📦 Existing database detected. Starting migration...');
            await migrateExistingData();
        } else {
            console.log('🆕 Fresh database setup...');
        }
        
        // Read and execute schema file
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        
        // Split schema into individual statements
        const statements = schema
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        console.log(`📝 Executing ${statements.length} database statements...`);
        
        for (const statement of statements) {
            if (statement.trim()) {
                try {
                    await sql.unsafe(statement);
                } catch (error) {
                    // Log error but continue (some statements might fail on re-run)
                    if (!error.message.includes('already exists')) {
                        console.warn(`⚠️  Statement warning: ${error.message}`);
                    }
                }
            }
        }
        
        // Verify setup
        await verifySetup();
        
        console.log('✅ Database setup completed successfully!');
        console.log('📊 Database is ready for StudyMetrics application');
        
        return { success: true, message: 'Database setup successful' };
        
    } catch (error) {
        console.error('❌ Database setup failed:', error);
        return { success: false, error: error.message };
    }
}

async function migrateExistingData() {
    try {
        console.log('🔄 Starting data migration...');
        
        // Step 1: Backup existing user data
        const existingUsers = await sql`
            SELECT id, username, pin_hash, created_at, last_login 
            FROM users 
            WHERE is_active = true
        `;
        
        const existingUserData = await sql`
            SELECT user_id, course_data, updated_at 
            FROM user_data
        `;
        
        console.log(`📋 Found ${existingUsers.rows.length} users and ${existingUserData.rows.length} user data records`);
        
        // Step 2: Create backup table
        await sql`
            CREATE TABLE IF NOT EXISTS migration_backup_${Date.now()} AS 
            SELECT u.*, ud.course_data, ud.updated_at as data_updated_at
            FROM users u
            LEFT JOIN user_data ud ON u.id = ud.user_id
        `;
        
        // Step 3: Migrate user data to include CGPA history
        for (const userData of existingUserData.rows) {
            const userId = userData.user_id;
            const courseData = userData.course_data;
            
            if (courseData && courseData.courses) {
                const stats = calculateCGPAFromCourses(courseData.courses);
                
                if (stats.totalCredits > 0) {
                    // Insert initial CGPA history entry
                    await sql`
                        INSERT INTO cgpa_history (user_id, cgpa, total_credits, grade_points, recorded_at)
                        VALUES (${userId}, ${stats.cgpa}, ${stats.totalCredits}, ${stats.totalPoints}, ${userData.updated_at})
                        ON CONFLICT DO NOTHING
                    `;
                }
            }
        }
        
        console.log('✅ Data migration completed successfully');
        
    } catch (error) {
        console.error('❌ Migration error:', error);
        throw error;
    }
}

function calculateCGPAFromCourses(courses) {
    const gradePoints = { S: 10, A: 9, B: 8, C: 7, D: 6, E: 4 };
    let totalPoints = 0;
    let totalCredits = 0;

    Object.entries(courses).forEach(([courseId, course]) => {
        if (course.grade && gradePoints[course.grade]) {
            const credits = getCreditsForCourse(courseId);
            totalPoints += gradePoints[course.grade] * credits;
            totalCredits += credits;
        }
    });

    const cgpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
    return { cgpa, totalCredits, totalPoints };
}

function getCreditsForCourse(courseId) {
    const [section, index] = courseId.split('-');
    
    const creditMap = {
        foundation: 4,
        programming: { '3': 2, '6': 2, '7': 3, default: 4 },
        dataScience: { '4': 2, '5': 3, 'opt-analytics': 4, 'opt-project': 2, default: 4 },
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

async function verifySetup() {
    console.log('🔍 Verifying database setup...');
    
    // Check all required tables exist
    const requiredTables = ['users', 'user_data', 'cgpa_history', 'study_sessions', 'user_sessions'];
    
    for (const table of requiredTables) {
        const result = await sql`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = ${table}
            );
        `;
        
        if (!result.rows[0].exists) {
            throw new Error(`Required table '${table}' does not exist`);
        }
    }
    
    // Check required functions exist
    const requiredFunctions = ['get_user_stats', 'get_user_analytics', 'cleanup_expired_sessions'];
    
    for (const func of requiredFunctions) {
        const result = await sql`
            SELECT EXISTS (
                SELECT FROM information_schema.routines 
                WHERE routine_schema = 'public' 
                AND routine_name = ${func}
            );
        `;
        
        if (!result.rows[0].exists) {
            console.warn(`⚠️  Function '${func}' does not exist - some features may not work`);
        }
    }
    
    // Test basic operations
    const userCount = await sql`SELECT COUNT(*) as count FROM users`;
    console.log(`👥 Current user count: ${userCount.rows[0].count}`);
    
    const sessionCount = await sql`SELECT COUNT(*) as count FROM study_sessions`;
    console.log(`📚 Current study sessions: ${sessionCount.rows[0].count}`);
    
    console.log('✅ Database verification completed');
}

// API endpoint for setup
module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const result = await setupDatabase();
    
    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(500).json(result);
    }
};

// Direct execution for scripts
if (require.main === module) {
    setupDatabase()
        .then(result => {
            console.log(result);
            process.exit(result.success ? 0 : 1);
        })
        .catch(error => {
            console.error('Setup failed:', error);
            process.exit(1);
        });
}