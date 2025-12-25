// Enhanced Chart.js loading check
function ensureChartJS() {
    return typeof Chart !== 'undefined';
}

// Initialize charts when Chart.js is ready (with retry limit)
function initializeChartsWhenReady(retryCount = 0) {
    if (typeof Chart !== 'undefined') {
        updateGradeDistribution();
        if (document.getElementById('cgpaTrendChart')) {
            updateCGPATrendChart();
        }
    } else if (retryCount < 50) { // Max 10 seconds (50 * 200ms)
        // Retry after a short delay
        setTimeout(() => initializeChartsWhenReady(retryCount + 1), 200);
    } else {
        console.error('Chart.js failed to load after multiple retries');
    }
}

// Course Database with corrected credit structure
const courseDatabase = {
    foundation: {
        title: "Foundation Level",
        totalCredits: 32,
        courses: [
            { name: "Mathematics for Data Science I", code: "BSMA1001", credits: 4 },
            { name: "Statistics for Data Science I", code: "BSMA1002", credits: 4 },
            { name: "Computational Thinking", code: "BSCS1001", credits: 4 },
            { name: "English I", code: "BSHS1001", credits: 4 },
            { name: "Mathematics for Data Science II", code: "BSMA1003", credits: 4 },
            { name: "Statistics for Data Science II", code: "BSMA1004", credits: 4 },
            { name: "Programming in Python", code: "BSCS1002", credits: 4 },
            { name: "English II", code: "BSHS1002", credits: 4 }
        ]
    },
    diploma: {
        programming: {
            title: "Diploma in Programming",
            totalCredits: 27,
            courses: [
                { name: "Database Management Systems", code: "BSCS2001", credits: 4 },
                { name: "Programming, Data Structures and Algorithms using Python", code: "BSCS2002", credits: 4 },
                { name: "Modern Application Development I", code: "BSCS2003", credits: 4 },
                { name: "Modern Application Development I - Project", code: "BSCS2003P", credits: 2 },
                { name: "Programming Concepts using Java", code: "BSCS2005", credits: 4 },
                { name: "Modern Application Development II", code: "BSCS2006", credits: 4 },
                { name: "Modern Application Development II - Project", code: "BSCS2006P", credits: 2 },
                { name: "System Commands", code: "BSSE2001", credits: 3 }
            ]
        },
        dataScience: {
            title: "Diploma in Data Science",
            totalCredits: 27,
            courses: [
                { name: "Machine Learning Foundations", code: "BSCS2004", credits: 4 },
                { name: "Business Data Management", code: "BSMS2001", credits: 4 },
                { name: "Machine Learning Techniques", code: "BSCS2007", credits: 4 },
                { name: "Machine Learning Practice", code: "BSCS2008", credits: 4 },
                { name: "Machine Learning Practice - Project", code: "BSCS2008P", credits: 2 },
                { name: "Tools in Data Science", code: "BSSE2002", credits: 3 },
                { name: "Business Analytics", code: "BSMS2002", credits: 4 },
                { name: "Business Data Management - Project", code: "BSMS2001P", credits: 2 },
                { name: "Introduction to GenAI and Deep Learning", code: "BSCS2009", credits: 4 },
                { name: "Introduction to GenAI and Deep Learning - Project", code: "BSCS2009P", credits: 2 }
            ]
        }
    },
    degree: {
        core: {
            title: "Degree Level - Core Courses",
            totalCredits: 20,
            courses: [
                { name: "Software Engineering", code: "BSCS3001", credits: 4 },
                { name: "Software Testing", code: "BSCS3002", credits: 4 },
                { name: "AI: Search Methods for Problem Solving", code: "BSCS3003", credits: 4 },
                { name: "Deep Learning", code: "BSCS3004", credits: 4 },
                { name: "Strategies for Professional Growth", code: "BSHS3001", credits: 4 }
            ]
        },
        electives: [
            { name: "Machine Learning Operations (MLOps)", code: "BSCS3119", credits: 4, category: "Machine Learning" },
            { name: "Introduction to Natural Language Processing (i-NLP)", code: "BSCS3114", credits: 4, category: "Machine Learning" },
            { name: "Deep Learning for Computer Vision", code: "BSCS3115", credits: 4, category: "Machine Learning" },
            { name: "Large Language Models", code: "BSCS3113", credits: 4, category: "Machine Learning" },
            { name: "Advanced Algorithms", code: "BSCS3110", credits: 4, category: "Computer Science" },
            { name: "Computer Systems Design", code: "BSCS3111", credits: 4, category: "Computer Science" },
            { name: "Operating Systems", code: "BSCS3117", credits: 4, category: "Computer Science" },
            { name: "Programming in C", code: "BSCS3112", credits: 4, category: "Programming" },
            { name: "Introduction to Big Data", code: "BSCS3109", credits: 4, category: "Data Science" },
            { name: "Data Visualization Design", code: "BSCS3103", credits: 4, category: "Data Science" },
            { name: "Big Data and Biological Networks", code: "BSCS3102", credits: 4, category: "Data Science" },
            { name: "Algorithmic Thinking in Bioinformatics", code: "BSCS3101", credits: 4, category: "Computer Science" },
            { name: "Linear Statistical Models", code: "BSMA3101", credits: 4, category: "Statistics" },
            { name: "Statistical Computing", code: "BSMA3102", credits: 4, category: "Statistics" },
            { name: "Mathematical Thinking", code: "BSMA3103", credits: 4, category: "Mathematics" },
            { name: "Mathematical Foundations of Generative AI", code: "BSMA3104", credits: 4, category: "Mathematics" },
            { name: "Corporate Finance", code: "BSMS3106", credits: 4, category: "Finance" },
            { name: "Financial Forensics", code: "BSMS3103", credits: 4, category: "Finance" },
            { name: "Managerial Economics", code: "BSMS3104", credits: 4, category: "Economics" },
            { name: "Game Theory and Strategy", code: "BSMS3105", credits: 4, category: "Economics" },
            { name: "Market Research", code: "BSMS3102", credits: 4, category: "Management" },
            { name: "Industry 4.0", code: "BSMS3101", credits: 4, category: "Management" },
            { name: "Speech Technology", code: "BSCS3105", credits: 4, category: "Computer Science" },
            { name: "Privacy & Security in Online Social Media", code: "BSCS3108", credits: 4, category: "Computer Science" },
            { name: "Design Thinking for Data-Driven App Development", code: "BSCS3106", credits: 4, category: "Application Development" },
            { name: "Special topics in Machine Learning (Reinforcement Learning)", code: "BSCS3104", credits: 4, category: "Machine Learning" },
            { name: "Sequential Decision Making", code: "BSCS3107", credits: 4, category: "Machine Learning" },
            { name: "Deep Learning Practice", code: "BSCS3116", credits: 4, category: "Machine Learning" },
            { name: "Algorithms for Data Science (ADS)", code: "BSCS3118", credits: 4, category: "Data Science" },
            { name: "Business Analytics", code: "BSMS2002", credits: 4, category: "Management" },
            { name: "Business Data Management - Project", code: "BSMS2001P", credits: 2, category: "Management" }
        ]
    }
};

// Grade Scale
const gradeScale = {
    'S': 10,
    'A': 9,
    'B': 8,
    'C': 7,
    'D': 6,
    'E': 4
};


// Grade Predictor Data (Hardcoded as requested, Client-side only)
const gradePredictorData = {
    "legend": {
        "T": "Total Course Score",
        "F": "Final End-Term Exam Score",
        "Qz1": "Quiz 1 Score",
        "Qz2": "Quiz 2 Score",
        "GAA": "Graded Assignment Average",
        "OPPE/PE/OP": "Proctored Programming Exam",
        "NPPE": "Non-Proctored Programming Exam",
        "GP": "Group Project",
        "V/Viva": "Viva Voce Score"
    },
    "levels": {
        "foundation": [
            { "course": "Mathematics for Data Science 1", "formula": "max(0.6*F + 0.3*max(Qz1, Qz2), 0.45*F + 0.25*Qz1 + 0.3*Qz2)" },
            { "course": "English 1", "formula": "max(0.6*F + 0.3*max(Qz1, Qz2), 0.45*F + 0.25*Qz1 + 0.3*Qz2)" },
            { "course": "Computational Thinking", "formula": "max(0.6*F + 0.3*max(Qz1, Qz2), 0.45*F + 0.25*Qz1 + 0.3*Qz2)" },
            { "course": "Statistics for Data Science 1", "formula": "max(0.6*F + 0.3*max(Qz1, Qz2), 0.45*F + 0.25*Qz1 + 0.3*Qz2)" },
            { "course": "Mathematics for Data Science 2", "formula": "min(100, max(0.6*F + 0.3*max(Qz1, Qz2), 0.45*F + 0.25*Qz1 + 0.3*Qz2))" },
            { "course": "English 2", "formula": "max(0.6*F + 0.3*max(Qz1, Qz2), 0.45*F + 0.25*Qz1 + 0.3*Qz2)" },
            { "course": "Intro to Python Programming", "formula": "0.15*Qz1 + 0.4*F + 0.25*max(PE1, PE2) + 0.2*min(PE1, PE2)" },
            { "course": "Statistics for Data Science 2", "formula": "max(0.6*F + 0.3*max(Qz1, Qz2), 0.45*F + 0.25*Qz1 + 0.3*Qz2)" }
        ],
        "diploma": [
            { "course": "Machine Learning Foundations", "formula": "0.05*GAA + max(0.6*F + 0.25*max(Qz1, Qz2), 0.4*F + 0.25*Qz1 + 0.3*Qz2)" },
            { "course": "Machine Learning Techniques", "formula": "0.05*GAA + max(0.6*F + 0.25*max(Qz1, Qz2), 0.4*F + 0.25*Qz1 + 0.3*Qz2)" },
            { "course": "Machine Learning Practice", "formula": "0.1*GAA + 0.3*F + 0.2*OPPE1 + 0.2*OPPE2 + 0.2*KA_avg" },
            { "course": "Business Data Management", "formula": "GA_best3_of_4 + Qz2 + Timed_Assignment + F" },
            { "course": "Business Analytics", "formula": "(0.7*max(Qz1, Qz2) + 0.3*min(Qz1, Qz2)) + Best2_Assignments + F" },
            { "course": "Tools in Data Science", "formula": "0.1*GAA + 0.2*ROE + 0.2*P1 + 0.2*P2 + 0.3*F" },
            { "course": "PDSA", "formula": "0.05*GAA + 0.2*OP + 0.45*F + max(0.2*max(Qz1, Qz2), (0.1*Qz1 + 0.2*Qz2))" },
            { "course": "DBMS", "formula": "0.03*GAA2 + 0.02*GAA3 + 0.2*OP + 0.45*F + max(0.2*max(Qz1, Qz2), (0.1*Qz1 + 0.2*Qz2))" },
            { "course": "Application Development - 1", "formula": "0.05*GLA + max(0.6*F + 0.25*max(Qz1, Qz2), 0.4*F + 0.25*Qz1 + 0.3*Qz2)" },
            { "course": "Programming Concepts using Java", "formula": "0.05*GAA + 0.2*max(PE1, PE2) + 0.45*F + max(0.2*max(Qz1, Qz2), (0.1*Qz1 + 0.2*Qz2)) + 0.1*min(PE1, PE2)" },
            { "course": "System Commands", "formula": "0.05*GAA + 0.25*Qz1 + 0.3*OPPE + 0.3*F + 0.1*BPTA" },
            { "course": "Application Development - 2", "formula": "0.05*GAA + max(0.6*F + 0.25*max(Qz1, Qz2), 0.4*F + 0.25*Qz1 + 0.3*Qz2)" },
            { "course": "Deep Learning and Generative AI", "formula": "0.1*GAA + 0.2*Qz1 + 0.2*Qz2 + 0.25*F + 0.1*NPPE1 + 0.15*NPPE2" }
        ],
        "degree": [
            { "course": "Software Testing", "formula": "0.1*GAA + 0.4*F + 0.25*Qz1 + 0.25*Qz2" },
            { "course": "Software Engineering", "formula": "0.05*GAA + 0.2*Qz2 + 0.4*F + 0.1*GP1 + 0.1*GP2 + 0.1*PP + 0.05*CP" },
            { "course": "Deep Learning", "formula": "0.05*GAA + 0.25*Qz1 + 0.25*Qz2 + 0.45*F" },
            { "course": "AI: Search Methods for Problem Solving", "formula": "0.1*GAA + 0.4*F + 0.25*Qz1 + 0.25*Qz2" },
            { "course": "Strategies for Professional Growth", "formula": "0.15*GAA + 0.25*GP + 0.25*Qz2 + 0.35*F" },
            { "course": "Introduction to Big Data", "formula": "0.1*GAA + 0.3*F + 0.2*OPPE1 + 0.4*OPPE2" },
            { "course": "Programming in C", "formula": "0.1*GAA + 0.2*Qz1 + 0.2*OPPE1 + 0.2*OPPE2 + 0.3*F" },
            { "course": "Deep Learning for CV", "formula": "0.1*GAA + 0.4*F + 0.25*Qz1 + 0.25*Qz2" },
            { "course": "Large Language Models", "formula": "0.05*GAA + 0.35*F + 0.3*Qz1 + 0.3*Qz2" },
            { "course": "Deep Learning Practice", "formula": "0.05*GA + 0.15*(Qz1+Qz2+Qz3) + 0.25*(avg(NPPE1,NPPE2,NPPE3)) + 0.25*Viva" },
            { "course": "Industry 4.0", "formula": "Quiz_Sum_15 + Game_5 + Asgn_Best2_40 + F + Project_10" },
            { "course": "Operating Systems", "formula": "0.1*GAA + 0.4*F + 0.25*Qz1 + 0.25*Qz2" },
            { "course": "Reinforcement Learning", "formula": "0.05*GAA + 0.4*GPA + max((0.15*Qz1 + 0.15*Qz2), 0.2*max(Qz1, Qz2)) + 0.25*F" },
            { "course": "Corporate Finance", "formula": "0.1*GAA + 0.4*F + 0.2*Qz1 + 0.3*Qz2" },
            { "course": "Computer Networks", "formula": "0.1*GAA + 0.3*F + 0.25*Qz1 + 0.25*Qz2 + 0.1*Prog_Asgn" },
            { "course": "Data Science and AI Lab", "formula": "0.05*GAA + 0.25*Quiz2 + 0.4*P + 0.3*V" },
            { "course": "Application Development Lab", "formula": "0.2*Quiz2 + 0.3*Weekly_Asgn + 0.5*Project_Viva" },
            { "course": "Algorithmic Thinking in Bioinformatics", "formula": "0.075*GAA + 0.25*GRPa + 0.25*Qz1 + 0.25*Qz2 + 0.4*F" },
            { "course": "Big Data and Biological Networks", "formula": "0.1*GAA + 0.4*F + 0.25*Qz1 + 0.25*Qz2" },
            { "course": "Market Research", "formula": "0.1*GAA + 0.2*Qz1 + 0.2*Qz2 + 0.25*P + 0.25*F" },
            { "course": "Statistical Computing", "formula": "0.1*GAA + 0.4*F + 0.25*Qz1 + 0.25*Qz2" },
            { "course": "Advanced Algorithms", "formula": "0.15*GAA + 0.35*F + 0.25*Qz1 + 0.25*Qz2" },
            { "course": "Managerial Economics", "formula": "0.15*GAA + max(0.2*Qz1 + 0.2*Qz2 + 0.45*F, 0.5*F + 0.25*max(Qz1, Qz2))" },
            { "course": "Speech Technology", "formula": "0.15*GAA + 0.15*V + 0.3*F + 0.2*Qz1 + 0.2*Qz2" },
            { "course": "MLOPS", "formula": "0.2*GAA + 0.3*F + 0.25*OPPE1 + 0.25*OPPE2" },
            { "course": "Mathematical Foundations of Generative AI", "formula": "0.05*GAA + 0.35*F + 0.2*Qz1 + 0.2*Qz2 + 0.2*NPPE" },
            { "course": "Theory of Computation", "formula": "0.1*GAA + 0.4*F + 0.25*Qz1 + 0.25*Qz2" }
        ]
    },
    "cutoffs": {
        'S': 90,
        'A': 80,
        'B': 70,
        'C': 60,
        'D': 50,
        'E': 40
    }
};

// Application State
let currentUser = null;
let userData = {
    courses: {},
    electives: [],
    targetCGPA: null,
    cgpaHistory: []
};

let whatIfCourses = [];
let autoSaveInterval = null;
let isRegistering = false;

// API Configuration
const API_BASE_URL = '/api';

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing app...');

    // Ensure all required DOM elements exist
    const requiredElements = [
        'loginPage', 'mainApp', 'userAvatar', 'welcomeMessage',
        'foundationCourses', 'programmingCourses', 'dataScienceCourses',
        'degreeCourses', 'electiveCourses'
    ];

    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    if (missingElements.length > 0) {
        console.error('Missing required DOM elements:', missingElements);
        return;
    }

    console.log('All required DOM elements found, proceeding with initialization...');
    initializeApp();
    registerServiceWorker();
    checkForUpdates();
});

// Register Service Worker for PWA
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            // Unregister old service workers first
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (let registration of registrations) {
                await registration.unregister();
            }

            const registration = await navigator.serviceWorker.register('/service-worker.js?v=4.1.2');
            console.log('Service Worker registered:', registration);

            // Force immediate update check
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showToast('New version available! Refreshing...', 'info');
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    }
                });
            });

            setInterval(() => {
                registration.update();
            }, 60000);
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }
}

// Check for app updates
async function checkForUpdates() {
    if ('serviceWorker' in navigator) {
        const currentVersion = '4.1.2'; // v4.1.2
        const storedVersion = localStorage.getItem('studymetrics_version');

        // Helper for safe reload
        const reloadForUpdate = () => {
            if (!sessionStorage.getItem('update_reloaded')) {
                sessionStorage.setItem('update_reloaded', 'true');
                showToast('New version available! Refreshing...', 'info');
                setTimeout(() => window.location.reload(), 1000);
            }
        };

        navigator.serviceWorker.addEventListener('controllerchange', reloadForUpdate);

        if (storedVersion && storedVersion !== currentVersion) {
            console.log(`Version mismatch: ${storedVersion} -> ${currentVersion}`);
            localStorage.setItem('studymetrics_version', currentVersion);

            // Clear old caches
            if ('caches' in window) {
                try {
                    const keys = await caches.keys();
                    await Promise.all(keys.map(key => {
                        if (key.startsWith('studymetrics-v') && !key.includes(currentVersion)) {
                            return caches.delete(key);
                        }
                    }));
                } catch (e) { console.error('Cache clear failed:', e); }
            }
            reloadForUpdate();
        } else {
            localStorage.setItem('studymetrics_version', currentVersion);
            // Clear the reload flag if versions match
            sessionStorage.removeItem('update_reloaded');
        }
    }
}

function initializeApp() {
    console.log('Initializing app...');

    // Clear old caches on app start
    clearOldCaches();

    setupEventListeners();


    const token = getStoredToken();
    if (token && token.length > 10) {
        console.log('Found stored token, verifying...');
        verifyAndLoadUser(token);
    } else {
        console.log('No valid token found, showing login');
        showLoginPage();
    }
}

// Clear old caches to ensure users get the latest version
async function clearOldCaches() {
    if ('caches' in window) {
        try {
            const cacheNames = await caches.keys();
            const oldCaches = cacheNames.filter(name =>
                name.startsWith('studymetrics-v') && name !== 'studymetrics-v3.5.9'
            );

            await Promise.all(oldCaches.map(name => {
                console.log('Clearing old cache:', name);
                return caches.delete(name);
            }));

            if (oldCaches.length > 0) {
                console.log('Cleared', oldCaches.length, 'old caches');
            }
        } catch (error) {
            console.error('Error clearing old caches:', error);
        }
    }
}

function initializeDefaultUserData() {
    console.log('Initializing default user data...');
    userData = {
        courses: {},
        electives: [],
        targetCGPA: null,
        cgpaHistory: []
    };
    console.log('Default userData initialized:', userData);
    renderAllCourses();
}

// Validate and fix userData structure
function validateUserData() {
    if (!userData || typeof userData !== 'object') {
        console.log('Invalid userData, initializing defaults');
        initializeDefaultUserData();
        return false;
    }

    // Ensure all required properties exist
    if (!userData.courses) userData.courses = {};
    if (!userData.electives) userData.electives = [];
    if (!userData.cgpaHistory) userData.cgpaHistory = [];

    console.log('UserData validated and fixed:', userData);
    return true;
}

// Enhanced token management with validation
function getStoredToken() {
    const token = localStorage.getItem('studymetrics_token') || sessionStorage.getItem('studymetrics_token');

    // Basic token validation
    if (token && token.length > 10 && token.includes('.')) {
        try {
            // Check if token is not expired (basic check)
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.exp && payload.exp * 1000 > Date.now()) {
                return token;
            } else {
                console.log('Token expired, removing...');
                removeStoredToken();
                return null;
            }
        } catch (e) {
            console.log('Invalid token format, removing...');
            removeStoredToken();
            return null;
        }
    }

    return null;
}

function storeToken(token, remember = true) {
    if (!token || token.length < 10) {
        console.error('Invalid token provided for storage');
        return;
    }

    if (remember) {
        localStorage.setItem('studymetrics_token', token);
        sessionStorage.removeItem('studymetrics_token');
        console.log('Token stored in localStorage');
    } else {
        sessionStorage.setItem('studymetrics_token', token);
        localStorage.removeItem('studymetrics_token');
        console.log('Token stored in sessionStorage');
    }
}

function removeStoredToken() {
    localStorage.removeItem('studymetrics_token');
    sessionStorage.removeItem('studymetrics_token');
    console.log('Tokens removed from storage');
}

function setupEventListeners() {
    // Auth form
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', handleAuth);

    // Toggle auth mode
    document.getElementById('toggleAuth').addEventListener('click', (e) => {
        e.preventDefault();
        toggleAuthMode();
    });

    // PIN input auto-focus
    setupPinInputs();

    // Navigation
    setupNavigation();

    // Save button
    document.getElementById('saveBtn').addEventListener('click', () => {
        manualSave();
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Electives
    document.getElementById('addElectiveBtn').addEventListener('click', showElectiveModal);
    document.getElementById('modalClose').addEventListener('click', hideElectiveModal);
    document.getElementById('electiveModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) hideElectiveModal();
    });
    document.getElementById('electiveSearch').addEventListener('input', filterElectives);

    // Target CGPA
    const targetInput = document.getElementById('targetCgpaInput');
    if (targetInput) {
        targetInput.addEventListener('change', saveTargetCGPA);
        targetInput.addEventListener('input', debounce(saveTargetCGPA, 500));
    }



    // What-if analysis
    window.addWhatIfCourse = addWhatIfCourse;
    window.removeWhatIfCourse = removeWhatIfCourse;
    window.calculateWhatIf = calculateWhatIf;
    window.calculateTargetCGPA = calculateTargetCGPA;

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Auto-save on visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && currentUser) {
            saveUserData();
        }
    });
}

function setupPinInputs() {
    const pinInputs = document.querySelectorAll('.pin-input');
    pinInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            // Only allow digits
            e.target.value = e.target.value.replace(/[^0-9]/g, '');

            if (e.target.value && index < pinInputs.length - 1) {
                pinInputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                pinInputs[index - 1].focus();
            }
        });

        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const paste = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
            const digits = paste.slice(0, 4).split('');

            digits.forEach((digit, i) => {
                if (pinInputs[i]) {
                    pinInputs[i].value = digit;
                }
            });

            if (digits.length > 0) {
                const lastIndex = Math.min(digits.length - 1, pinInputs.length - 1);
                pinInputs[lastIndex].focus();
            }
        });
    });
}

function setupNavigation() {
    // SPA Navigation Logic
    const tabs = document.querySelectorAll('.nav-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const href = tab.getAttribute('href');

            // Update URL without reload
            window.history.pushState({}, '', href);

            // Handle View Switching
            updateView(href);
        });
    });

    // Handle initial load and back/forward buttons
    window.addEventListener('popstate', () => {
        updateView(window.location.pathname);
    });

    // Initial view
    updateView(window.location.pathname);
}

function updateView(path) {
    const route = path.split('/').pop() || '';

    // Update Active Tab
    document.querySelectorAll('.nav-tab').forEach(t => {
        t.classList.toggle('active', t.getAttribute('href') === (path === '/' ? '/' : path));
    });

    // Hide all sections
    ['dashboardSection', 'analyticsSection', 'gradePredictorSection'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    // Show target section
    if (route === '' || route === 'index.html') {
        const dash = document.getElementById('dashboardSection');
        if (dash) dash.style.display = 'block';
    } else if (route === 'analytics') {
        const analytics = document.getElementById('analyticsSection');
        if (analytics) analytics.style.display = 'block';
        if (typeof initializeAnalytics === 'function' && !window.analyticsInitialized) {
            initializeAnalytics();
            window.analyticsInitialized = true;
        }
    } else if (route === 'grade-predictor') {
        const predictor = document.getElementById('gradePredictorSection');
        if (predictor) predictor.style.display = 'block';
        if (!window.gradePredictorInitialized) {
            if (typeof initGradePredictor === 'function') initGradePredictor();
            window.gradePredictorInitialized = true;
        }
    }
}

function toggleAuthMode() {
    isRegistering = !isRegistering;
    updateAuthUI();
}

function updateAuthUI() {
    const btnText = document.getElementById('authBtnText');
    const toggleLink = document.getElementById('toggleAuth');
    const toggleText = document.getElementById('toggleText');
    const subtitle = document.querySelector('.login-subtitle');

    if (isRegistering) {
        btnText.textContent = 'Create Account';
        toggleLink.textContent = 'Login instead';
        toggleText.textContent = 'Already have an account?';
        subtitle.textContent = 'Create your account to get started';
    } else {
        btnText.textContent = 'Login';
        toggleLink.textContent = 'Create one';
        toggleText.textContent = 'Don\'t have an account?';
        subtitle.textContent = 'Track your IITM BS academic progress';
    }
}

async function handleAuth(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const pinInputs = document.querySelectorAll('.pin-input');
    const pin = Array.from(pinInputs).map(input => input.value).join('');

    if (!username || username.length < 3) {
        showToast('Username must be at least 3 characters long', 'error');
        return;
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
        showToast('Please enter a valid 4-digit PIN', 'error');
        return;
    }

    showLoader('authBtnText', 'authLoader');
    document.getElementById('authSubmitBtn').disabled = true;

    try {
        const endpoint = isRegistering ? '/auth/register' : '/auth/login';
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, pin })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Authentication successful:', data);
            storeToken(data.token, true); // Remember by default
            currentUser = data.user;
            showMainApp();

            // Load user data and wait for completion before proceeding
            try {
                await loadUserData();
                console.log('User data loaded successfully');
            } catch (error) {
                console.error('Failed to load user data:', error);
                initializeDefaultUserData();
                showToast('Using default data due to loading error', 'warning');
            }

            showToast(isRegistering ? 'Account created successfully!' : 'Welcome back!', 'success');
        } else {
            const errorData = await response.json().catch(() => ({ error: 'Authentication failed' }));
            console.error('Authentication failed:', errorData);
            showToast(errorData.error || errorData.message || 'Authentication failed', 'error');
        }
    } catch (error) {
        console.error('Auth error:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        hideLoader('authBtnText', 'authLoader');
        document.getElementById('authSubmitBtn').disabled = false;
    }
}

async function verifyAndLoadUser(token) {
    try {
        console.log('Verifying user token...');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            headers: { 'Authorization': `Bearer ${token}` },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            console.log('User verified:', data.user);
            currentUser = data.user;
            showMainApp();

            // Load user data with proper error handling
            try {
                await loadUserData();
                console.log('User data loaded after verification');
            } catch (error) {
                console.error('Failed to load user data after verification:', error);
                initializeDefaultUserData();
                showToast('Using default data', 'warning');
            }
        } else if (response.status === 401) {
            console.log('Token expired or invalid, redirecting to login');
            removeStoredToken();
            showLoginPage();
        } else {
            throw new Error(`Verification failed: ${response.status}`);
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('Token verification timed out');
        } else {
            console.error('Token verification failed:', error);
        }
        removeStoredToken();
        showLoginPage();
    }
}

function showLoginPage() {
    window.location.href = '/login';
}

function showMainApp() {
    console.log('Showing main app...');

    const loginPage = document.getElementById('loginPage');
    const mainApp = document.getElementById('mainApp');

    if (!loginPage || !mainApp) {
        console.error('Required DOM elements not found');
        return;
    }

    // Hide loading and login, show main app
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) loadingScreen.style.display = 'none';
    loginPage.style.display = 'none';
    mainApp.style.display = 'block';
    document.body.style.overflow = 'auto';

    // Update user info
    const avatar = document.getElementById('userAvatar');
    const welcome = document.getElementById('welcomeMessage');

    if (avatar && welcome && currentUser) {
        avatar.textContent = currentUser.username[0].toUpperCase();
        welcome.textContent = `Welcome, ${currentUser.username}`;
    }

    // Start auto-save
    startAutoSave();

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Validate userData structure
    validateUserData();

    console.log('Main app shown successfully');
}

async function loadUserData() {
    try {
        console.log('Loading user data...');
        const token = getStoredToken();

        if (!token) {
            console.error('No token available for data loading');
            initializeDefaultUserData();
            return;
        }

        const response = await fetch(`${API_BASE_URL}/user/data`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('API Response:', data);

            if (data.success && data.userData) {
                userData = {
                    courses: data.userData.courses || {},
                    electives: data.userData.electives || [],
                    targetCGPA: data.userData.targetCGPA || null,
                    cgpaHistory: data.userData.cgpaHistory || []
                };

                console.log('Loaded user data:', userData);

                if (userData.targetCGPA) {
                    const targetInput = document.getElementById('targetCgpaInput');
                    if (targetInput) targetInput.value = userData.targetCGPA;
                }

                renderAllCourses();
                updateAnalytics();
                showToast('Data loaded', 'success');
            } else {
                initializeDefaultUserData();
            }
        } else if (response.status === 401) {
            logout();
        } else {
            initializeDefaultUserData();
        }
    } catch (error) {
        console.error('Load error:', error);
        initializeDefaultUserData();
    }
}

function renderAllCourses() {
    try {
        console.log('Rendering all courses with userData:', userData);

        // Validate userData structure
        if (!userData || typeof userData !== 'object') {
            console.error('Invalid userData structure:', userData);
            initializeDefaultUserData();
            return;
        }

        // Check if main app is visible
        const mainApp = document.getElementById('mainApp');
        // Add safeguard: Only defer if we haven't retried too many times (handled by caller usually, but adding safe check)
        if ((!mainApp || mainApp.style.display === 'none') && !window.renderingForced) {
            console.log('Main app not visible, deferring course rendering...');
            // We'll rely on showMainApp calling this, but if called independently, stop if hidden
            return;
        }

        // Check if course containers exist
        const courseContainers = [
            'foundationCourses', 'programmingCourses', 'dataScienceCourses',
            'degreeCourses', 'electiveCourses'
        ];

        const missingContainers = courseContainers.filter(id => !document.getElementById(id));
        if (missingContainers.length > 0) {
            console.error('Missing course containers:', missingContainers);
            setTimeout(() => renderAllCourses(), 100);
            return;
        }

        // Basic course database validation
        if (!courseDatabase) {
            console.error('Course database not loaded');
            return;
        }

        console.log('Course database structure:', {
            foundation: courseDatabase.foundation?.courses?.length || 0,
            programming: courseDatabase.diploma?.programming?.courses?.length || 0,
            dataScience: courseDatabase.diploma?.dataScience?.courses?.length || 0,
            degreeCore: courseDatabase.degree?.core?.courses?.length || 0,
            electives: courseDatabase.degree?.electives?.length || 0
        });

        // Ensure userData integrity
        if (!userData.courses) userData.courses = {};
        if (!userData.electives) userData.electives = [];
        if (!userData.dataScienceOptions) userData.dataScienceOptions = { analytics: true, project: true };

        // Render all sections
        console.log('Rendering foundation courses:', courseDatabase.foundation.courses.length);
        renderCourseList('foundationCourses', courseDatabase.foundation.courses, 'foundation');

        console.log('Rendering programming courses:', courseDatabase.diploma.programming.courses.length);
        renderCourseList('programmingCourses', courseDatabase.diploma.programming.courses, 'programming');

        console.log('Rendering data science courses');
        renderDataScienceCourses();

        console.log('Rendering degree courses:', courseDatabase.degree.core.courses.length);
        renderCourseList('degreeCourses', courseDatabase.degree.core.courses, 'degreeCore');

        console.log('Rendering electives');
        renderElectives();

        // Update all analytics after rendering
        updateAnalytics();

        // Initialize progress circles after courses are rendered
        setTimeout(() => {
            updateProgress();
        }, 100);

        console.log('All courses rendered successfully');
    } catch (error) {
        console.error('Error rendering courses:', error);
        showToast('Error loading course data', 'error');
    }
}

function renderCourseList(containerId, courses, section, retryCount = 0) {
    console.log(`Attempting to render ${containerId} with ${courses?.length || 0} courses`);

    // Check if DOM is ready
    if (document.readyState !== 'complete') {
        if (retryCount < 20) {
            console.log('DOM not ready, deferring course rendering...');
            setTimeout(() => renderCourseList(containerId, courses, section, retryCount + 1), 100);
        } else {
            console.error(`Failed to render ${containerId}: DOM never became ready`);
        }
        return;
    }

    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container ${containerId} not found in DOM`);
        return;
    }

    container.innerHTML = '';

    if (!courses || courses.length === 0) {
        console.log(`No courses provided for ${containerId}`);
        container.innerHTML = '<div class="text-sm text-secondary">No courses available</div>';
        return;
    }

    console.log(`Rendering ${courses.length} courses for ${containerId}`);
    courses.forEach((course, index) => {
        const courseCard = createCourseCard(course, section, index);
        container.appendChild(courseCard);
    });

    console.log(`Successfully rendered ${courses.length} courses for ${containerId}`);
}

function renderDataScienceCourses() {
    const container = document.getElementById('dataScienceCourses');
    if (!container) return;

    container.innerHTML = '';

    // Render all courses normally
    courseDatabase.diploma.dataScience.courses.forEach((course, index) => {
        const courseCard = createCourseCard(course, 'dataScience', index);
        container.appendChild(courseCard);
    });
}



function createCourseCard(course, section, index) {
    const div = document.createElement('div');
    div.className = 'course-card fade-in';
    div.dataset.courseId = `${section}-${index}`;

    const savedData = userData.courses[`${section}-${index}`] || {};
    const grade = savedData.grade || '';

    const removeBtn = section === 'elective' ? `
        <button onclick="removeElective('${index}')" class="whatif-remove" style="margin-left: 0.5rem;">×</button>
    ` : '';

    div.innerHTML = `
        <div class="course-info">
            <div class="course-code">${course.code}</div>
            <div class="course-name">${course.name}</div>
        </div>
        <div class="course-controls">
            <div class="credits-display">${course.credits} credits</div>
            <div class="grade-selector-container">
                <div class="grade-buttons-row" data-course-id="${section}-${index}">
                    <button class="grade-btn ${!grade ? 'active' : ''}" data-grade="">-</button>
                    <button class="grade-btn grade-s ${grade === 'S' ? 'active' : ''}" data-grade="S">S</button>
                    <button class="grade-btn grade-a ${grade === 'A' ? 'active' : ''}" data-grade="A">A</button>
                    <button class="grade-btn grade-b ${grade === 'B' ? 'active' : ''}" data-grade="B">B</button>
                    <button class="grade-btn grade-c ${grade === 'C' ? 'active' : ''}" data-grade="C">C</button>
                    <button class="grade-btn grade-d ${grade === 'D' ? 'active' : ''}" data-grade="D">D</button>
                    <button class="grade-btn grade-e ${grade === 'E' ? 'active' : ''}" data-grade="E">E</button>
                </div>
            </div>
            ${removeBtn}
        </div>
    `;

    // Add grade selector functionality
    const gradeContainer = div.querySelector('.grade-buttons-row');
    if (gradeContainer) {
        const gradeButtons = gradeContainer.querySelectorAll('.grade-btn');

        gradeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();

                const grade = btn.dataset.grade;
                const courseId = gradeContainer.dataset.courseId;

                // Update visual state
                gradeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Handle grade change
                handleGradeChange(courseId, grade);
            });
        });
    }

    return div;
}

function handleGradeChange(courseId, grade) {
    console.log(`Grade change: ${courseId} -> ${grade}`);

    // Validate userData structure
    if (!validateUserData()) {
        console.error('Invalid userData structure during grade change');
        return;
    }

    // Initialize course data if needed
    if (!userData.courses[courseId]) {
        userData.courses[courseId] = {};
    }

    // Update grade (empty string for no grade)
    userData.courses[courseId].grade = grade || '';

    console.log('Updated userData.courses:', userData.courses);

    // Update grade button styling
    const gradeContainer = document.querySelector(`[data-course-id="${courseId}"]`);
    if (gradeContainer) {
        const buttons = gradeContainer.querySelectorAll('.grade-btn');
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.grade === grade);
        });
    }

    // Update analytics immediately
    updateAnalytics();
    updateCGPAHistory();

    // Auto-save with debouncing (increased delay to reduce API calls)
    clearTimeout(window.autoSaveTimeout);
    window.autoSaveTimeout = setTimeout(async () => {
        updateSaveButtonState('saving');
        try {
            const success = await saveUserDataWithRetry(false);
            if (success) {
                console.log('Auto-save successful for grade change');
                updateSaveButtonState('saved');
                localStorage.setItem('studymetrics_last_save', Date.now().toString());
            } else {
                console.error('Auto-save failed');
                updateSaveButtonState('error');
            }
        } catch (error) {
            console.error('Auto-save error:', error);
            updateSaveButtonState('error');
        }

        // Reset button state after delay
        setTimeout(() => {
            updateSaveButtonState('default');
        }, 2000);
    }, 3000); // Increased from 1s to 3s to reduce API calls
}



function renderElectives() {
    const container = document.getElementById('electiveCourses');
    if (!container) return;

    container.innerHTML = '';

    userData.electives.forEach(electiveCode => {
        const elective = courseDatabase.degree.electives.find(e => e.code === electiveCode);
        if (elective) {
            const courseCard = createCourseCard(elective, 'elective', electiveCode);
            container.appendChild(courseCard);
        }
    });
}

function showElectiveModal() {
    document.getElementById('electiveModal').classList.add('active');
    renderElectiveList();
}

function hideElectiveModal() {
    document.getElementById('electiveModal').classList.remove('active');
    document.getElementById('electiveSearch').value = '';
}

function renderElectiveList(filter = '') {
    const container = document.getElementById('electiveList');
    container.innerHTML = '';

    const availableElectives = courseDatabase.degree.electives.filter(elective =>
        !userData.electives.includes(elective.code) &&
        (filter === '' ||
            elective.name.toLowerCase().includes(filter.toLowerCase()) ||
            elective.code.toLowerCase().includes(filter.toLowerCase()) ||
            (elective.category && elective.category.toLowerCase().includes(filter.toLowerCase())))
    );

    // Group by category
    const grouped = {};
    availableElectives.forEach(elective => {
        const category = elective.category || 'Other';
        if (!grouped[category]) grouped[category] = [];
        grouped[category].push(elective);
    });

    Object.entries(grouped).forEach(([category, electives]) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.innerHTML = `
            <h4 style="color: var(--text-secondary); font-size: 0.75rem; font-weight: 600; margin: 1rem 0 0.5rem 0; text-transform: uppercase;">
                ${category}
            </h4>
        `;
        container.appendChild(categoryDiv);

        electives.forEach(elective => {
            const div = document.createElement('div');
            div.className = 'elective-item';
            div.innerHTML = `
                <div class="elective-item-name">${elective.name}</div>
                <div class="elective-item-meta">
                    <span style="color: var(--accent-primary); font-weight: 600;">${elective.code}</span>
                    <span>${elective.credits} credits</span>
                    <span style="background: var(--bg-primary); padding: 0.125rem 0.5rem; border-radius: 0.25rem; font-size: 0.6875rem;">${elective.category}</span>
                </div>
            `;

            div.onclick = () => addElective(elective.code);
            container.appendChild(div);
        });
    });
}

function filterElectives(e) {
    renderElectiveList(e.target.value);
}

function addElective(code) {
    if (!userData.electives.includes(code)) {
        userData.electives.push(code);
        renderElectives();
        updateAnalytics();
        saveUserData();
        showToast('Elective added successfully!', 'success');
    }
    hideElectiveModal();
}

function removeElective(code) {
    userData.electives = userData.electives.filter(e => e !== code);
    delete userData.courses[`elective-${code}`];
    renderElectives();
    updateAnalytics();
    saveUserData();
    showToast('Elective removed', 'success');
}

function updateAnalytics() {
    console.log('Updating all analytics...');

    calculateCGPA();
    updateProgress();
    updateSectionCredits();

    // Update hero CGPA display
    updateHeroCGPA();
}

function calculateCGPA() {
    let totalGradePoints = 0;
    let totalCredits = 0;

    // Section-wise calculations
    const sections = {
        foundation: { points: 0, credits: 0 },
        programming: { points: 0, credits: 0 },
        dataScience: { points: 0, credits: 0 },
        degree: { points: 0, credits: 0 }
    };

    Object.entries(userData.courses).forEach(([courseId, data]) => {
        if (data.grade && gradeScale[data.grade]) {
            const [section, index] = courseId.split('-');
            let credits = 0;

            // Get credits based on course type
            if (section === 'foundation') {
                const course = courseDatabase.foundation.courses[parseInt(index)];
                credits = course ? course.credits : 4;
                sections.foundation.points += gradeScale[data.grade] * credits;
                sections.foundation.credits += credits;
            } else if (section === 'programming') {
                const course = courseDatabase.diploma.programming.courses[parseInt(index)];
                credits = course ? course.credits : 4;
                sections.programming.points += gradeScale[data.grade] * credits;
                sections.programming.credits += credits;
            } else if (section === 'dataScience') {
                const course = courseDatabase.diploma.dataScience.courses[parseInt(index)];
                credits = course ? course.credits : 4;
                sections.dataScience.points += gradeScale[data.grade] * credits;
                sections.dataScience.credits += credits;
            } else if (section === 'degreeCore') {
                const course = courseDatabase.degree.core.courses[parseInt(index)];
                credits = course ? course.credits : 4;
                sections.degree.points += gradeScale[data.grade] * credits;
                sections.degree.credits += credits;
            } else if (section === 'elective') {
                const electiveCode = index;
                const course = courseDatabase.degree.electives.find(e => e.code === electiveCode);
                credits = course ? course.credits : 4;
                sections.degree.points += gradeScale[data.grade] * credits;
                sections.degree.credits += credits;
            }

            totalGradePoints += gradeScale[data.grade] * credits;
            totalCredits += credits;
        }
    });

    // Store calculated values for other functions
    window.currentCGPA = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '0.00';
    window.currentCredits = totalCredits;



    // Update hero section CGPAs
    const heroElements = {
        foundationCgpaHero: sections.foundation,
        programmingCgpaHero: sections.programming,
        dataScienceCgpaHero: sections.dataScience,
        degreeCgpaHero: sections.degree
    };

    Object.entries(heroElements).forEach(([elementId, sectionData]) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = sectionData.credits > 0 ?
                (sectionData.points / sectionData.credits).toFixed(2) : '0.00';
        }
    });
}

function updateHeroCGPA() {
    const cgpa = window.currentCGPA || '0.00';
    const credits = window.currentCredits || 0;

    // Update hero CGPA display
    const heroElement = document.getElementById('mainCgpaHero');
    const heroSubtitle = document.getElementById('cgpaHeroSubtitle');

    if (heroElement) heroElement.textContent = cgpa;
    if (heroSubtitle) heroSubtitle.textContent = `${credits} out of 142 credits completed`;
}

function updateProgress() {
    let completedCredits = 0;

    Object.entries(userData.courses).forEach(([courseId, data]) => {
        if (data.grade) {
            const [section, index] = courseId.split('-');
            let credits = 0;

            if (section === 'foundation') {
                credits = courseDatabase.foundation.courses[parseInt(index)]?.credits || 4;
            } else if (section === 'programming') {
                credits = courseDatabase.diploma.programming.courses[parseInt(index)]?.credits || 4;
            } else if (section === 'dataScience') {
                credits = courseDatabase.diploma.dataScience.courses[parseInt(index)]?.credits || 4;
            } else if (section === 'degreeCore') {
                credits = courseDatabase.degree.core.courses[parseInt(index)]?.credits || 4;
            } else if (section === 'elective') {
                const course = courseDatabase.degree.electives.find(e => e.code === index);
                credits = course ? course.credits : 4;
            }

            completedCredits += credits;
        }
    });

    const percentage = Math.min(100, (completedCredits / 142) * 100);

    // Update hero progress
    const heroProgressElement = document.getElementById('progressPercentHero');
    const heroProgressCircle = document.getElementById('progressCircleHero');

    if (heroProgressElement) heroProgressElement.textContent = `${Math.round(percentage)}%`;

    if (heroProgressCircle) {
        const heroCircumference = 2 * Math.PI * 55;
        const heroOffset = heroCircumference - (percentage / 100 * heroCircumference);
        heroProgressCircle.style.strokeDasharray = heroCircumference;
        heroProgressCircle.style.strokeDashoffset = heroOffset;
    }
}



function showChartPlaceholder(ctx, message) {
    const chartCtx = ctx.getContext('2d');

    // Set canvas size
    ctx.width = 160;
    ctx.height = 160;

    chartCtx.clearRect(0, 0, 160, 160);
    chartCtx.fillStyle = '#94a3b8';
    chartCtx.font = '12px Inter';
    chartCtx.textAlign = 'center';
    chartCtx.textBaseline = 'middle';
    chartCtx.fillText(message, 80, 80);
}

function updateSectionCredits() {
    const sectionCredits = {
        foundation: { completed: 0, total: 32 },
        programming: { completed: 0, total: 27 },
        dataScience: { completed: 0, total: 27 },
        degreeCore: { completed: 0, total: 20 },
        electives: { completed: 0, total: 36 }
    };

    Object.entries(userData.courses).forEach(([courseId, data]) => {
        if (data.grade) {
            const [section, index] = courseId.split('-');
            let credits = 0;

            if (section === 'foundation') {
                credits = courseDatabase.foundation.courses[parseInt(index)]?.credits || 4;
                sectionCredits.foundation.completed += credits;
            } else if (section === 'programming') {
                credits = courseDatabase.diploma.programming.courses[parseInt(index)]?.credits || 4;
                sectionCredits.programming.completed += credits;
            } else if (section === 'dataScience') {
                credits = courseDatabase.diploma.dataScience.courses[parseInt(index)]?.credits || 4;
                sectionCredits.dataScience.completed += credits;
            } else if (section === 'degreeCore') {
                credits = courseDatabase.degree.core.courses[parseInt(index)]?.credits || 4;
                sectionCredits.degreeCore.completed += credits;
            } else if (section === 'elective') {
                const course = courseDatabase.degree.electives.find(e => e.code === index);
                credits = course ? course.credits : 4;
                sectionCredits.electives.completed += credits;
            }
        }
    });



    // Update credit badges
    const badgeElements = {
        foundationCredits: sectionCredits.foundation,
        programmingCredits: sectionCredits.programming,
        dataScienceCredits: sectionCredits.dataScience,
        degreeCredits: sectionCredits.degreeCore,
        electiveCredits: sectionCredits.electives
    };

    Object.entries(badgeElements).forEach(([elementId, sectionData]) => {
        const element = document.getElementById(elementId);
        if (element) {
            const suffix = elementId === 'electiveCredits' ? '+' : '';
            element.textContent = `${sectionData.completed}/${sectionData.total}${suffix} credits`;
        }
    });
}


function handleNavigation() {
    // Set active nav tab based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-tab').forEach(tab => {
        const href = tab.getAttribute('href');
        tab.classList.toggle('active', href === currentPage);
    });
}

function initializeAnalytics() {
    console.log('Initializing analytics...');

    // Check if analytics section is visible
    const analyticsSection = document.getElementById('analyticsSection');
    if (!analyticsSection || analyticsSection.style.display === 'none') {
        console.log('Analytics section not visible, deferring initialization...');
        setTimeout(() => initializeAnalytics(), 100);
        return;
    }

    // Check if Chart.js is available
    if (!ensureChartJS()) {
        console.error('Chart.js not loaded');
        showToast('Chart library not available', 'error');
        return;
    }

    console.log('Chart.js available, updating charts...');

    // Update charts with a small delay to ensure DOM is ready
    setTimeout(() => {
        if (ensureChartJS()) {
            updateCGPATrendChart();
        }
        if (userData.targetCGPA) {
            const targetInput = document.getElementById('targetCgpaInput');
            if (targetInput) {
                targetInput.value = userData.targetCGPA;
            }
        }
        initializeWhatIfAnalysis();
    }, 100);
}

function updateCGPATrendChart() {
    console.log('Updating CGPA trend chart...');

    if (typeof Chart === 'undefined') {
        console.log('Chart.js not loaded yet, retrying in 500ms...');
        setTimeout(updateCGPATrendChart, 500);
        return;
    }

    const ctx = document.getElementById('cgpaTrendChart');
    if (!ctx) {
        console.error('CGPA trend chart canvas not found');
        return;
    }

    // Clear previous chart
    if (window.cgpaTrendChart) {
        window.cgpaTrendChart.destroy();
    }

    const trendData = userData.cgpaHistory || [];

    if (trendData.length > 1) {
        try {
            const sortedData = [...trendData].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            window.cgpaTrendChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: sortedData.map((entry, index) => `Update ${index + 1}`),
                    datasets: [{
                        label: 'CGPA',
                        data: sortedData.map(entry => parseFloat(entry.cgpa)),
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#6366f1',
                        pointBorderColor: '#f8fafc',
                        pointBorderWidth: 3,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: Math.max(0, Math.min(...sortedData.map(e => parseFloat(e.cgpa))) - 0.5),
                            max: 10,
                            grid: {
                                color: '#334155',
                                lineWidth: 1
                            },
                            ticks: {
                                color: '#cbd5e1',
                                font: { size: 12 }
                            }
                        },
                        x: {
                            grid: {
                                color: '#334155',
                                lineWidth: 1
                            },
                            ticks: {
                                color: '#cbd5e1',
                                font: { size: 12 }
                            }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    }
                }
            });

            console.log('CGPA trend chart created successfully');
        } catch (error) {
            console.error('Error creating CGPA trend chart:', error);
            showChartPlaceholder(ctx, 'Chart Error');
        }
    } else {
        showChartPlaceholder(ctx, 'CGPA trend will appear as you add grades');
    }
}

function updateCGPAHistory() {
    const currentStats = calculateCurrentStats();
    const currentCGPA = parseFloat(currentStats.cgpa);

    if (currentCGPA > 0) {
        const lastEntry = userData.cgpaHistory[userData.cgpaHistory.length - 1];
        const shouldAddEntry = !lastEntry ||
            Math.abs(parseFloat(lastEntry.cgpa) - currentCGPA) > 0.01 ||
            lastEntry.credits !== currentStats.completedCredits;

        if (shouldAddEntry) {
            userData.cgpaHistory.push({
                cgpa: currentStats.cgpa,
                credits: currentStats.completedCredits,
                timestamp: new Date().toISOString()
            });

            // Keep only last 20 entries
            if (userData.cgpaHistory.length > 20) {
                userData.cgpaHistory = userData.cgpaHistory.slice(-20);
            }

            saveUserData();
        }
    }
}

function calculateCurrentStats() {
    let totalGradePoints = 0;
    let completedCredits = 0;

    Object.entries(userData.courses).forEach(([courseId, data]) => {
        if (data.grade && gradeScale[data.grade]) {
            const [section, index] = courseId.split('-');
            let credits = 4; // Default credits

            if (section === 'foundation') {
                const course = courseDatabase.foundation.courses[parseInt(index)];
                credits = course ? course.credits : 4;
            } else if (section === 'programming') {
                const course = courseDatabase.diploma.programming.courses[parseInt(index)];
                credits = course ? course.credits : 4;
            } else if (section === 'dataScience') {
                const course = courseDatabase.diploma.dataScience.courses[parseInt(index)];
                credits = course ? course.credits : 4;
            } else if (section === 'degreeCore') {
                const course = courseDatabase.degree.core.courses[parseInt(index)];
                credits = course ? course.credits : 4;
            } else if (section === 'elective') {
                const electiveCode = index;
                const course = courseDatabase.degree.electives.find(e => e.code === electiveCode);
                credits = course ? course.credits : 4;
            }

            totalGradePoints += gradeScale[data.grade] * credits;
            completedCredits += credits;
        }
    });

    return {
        totalGradePoints,
        completedCredits,
        cgpa: completedCredits > 0 ? (totalGradePoints / completedCredits).toFixed(2) : '0.00'
    };
}

async function saveTargetCGPA() {
    const targetInput = document.getElementById('targetCgpaInput');
    if (!targetInput) return;

    const targetCGPA = parseFloat(targetInput.value);
    if (targetCGPA && targetCGPA >= 0 && targetCGPA <= 10) {
        userData.targetCGPA = targetCGPA;
        await saveUserData();
    }
}

async function calculateTargetCGPA() {
    const targetInput = document.getElementById('targetCgpaInput');
    const targetCGPA = parseFloat(targetInput.value);

    if (!targetCGPA || targetCGPA < 0 || targetCGPA > 10) {
        showToast('Please enter a valid target CGPA (0-10)', 'error');
        return;
    }

    const currentStats = calculateCurrentStats();
    const completedCredits = currentStats.completedCredits;
    const remainingCredits = 142 - completedCredits;

    if (remainingCredits <= 0) {
        document.getElementById('targetAnalysisResult').innerHTML = `
            <div style="color: var(--accent-success); padding: 1rem; background: rgba(16, 185, 129, 0.1); border-radius: 0.5rem; border: 1px solid rgba(16, 185, 129, 0.3);">
                <strong>🎉 Congratulations!</strong><br>
                You have completed all required credits!
            </div>
        `;
        return;
    }

    try {
        const token = getStoredToken();
        if (!token) {
            performLocalTargetCalculation(targetCGPA, currentStats, remainingCredits);
            return;
        }

        const response = await fetch(`${API_BASE_URL}/analytics/target-cgpa`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ targetCGPA, remainingCredits })
        });

        if (response.ok) {
            const data = await response.json();
            displayTargetAnalysis(data);
        } else {
            // Fallback calculation
            performLocalTargetCalculation(targetCGPA, currentStats, remainingCredits);
        }
    } catch (error) {
        console.error('Target CGPA calculation failed:', error);
        performLocalTargetCalculation(targetCGPA, currentStats, remainingCredits);
    }
}

function performLocalTargetCalculation(targetCGPA, currentStats, remainingCredits) {
    const requiredTotalPoints = targetCGPA * (currentStats.completedCredits + remainingCredits);
    const requiredNewPoints = requiredTotalPoints - currentStats.totalGradePoints;
    const requiredAvgGrade = requiredNewPoints / remainingCredits;

    const feasible = requiredAvgGrade <= 10 && requiredAvgGrade >= 0;

    displayTargetAnalysis({
        currentCGPA: currentStats.cgpa,
        currentCredits: currentStats.completedCredits,
        targetCGPA,
        remainingCredits,
        requiredAverageGrade: requiredAvgGrade.toFixed(2),
        feasible,
        recommendations: generateLocalRecommendations(requiredAvgGrade, remainingCredits)
    });
}

function generateLocalRecommendations(requiredAvg, credits) {
    const recommendations = [];
    const coursesNeeded = Math.ceil(credits / 4);

    // Generate different combinations
    for (let sCount = 0; sCount <= Math.min(coursesNeeded, 5); sCount++) {
        for (let aCount = 0; aCount <= Math.min(coursesNeeded - sCount, 5); aCount++) {
            const remaining = coursesNeeded - sCount - aCount;
            if (remaining >= 0 && remaining <= 10) {
                const totalPoints = sCount * 40 + aCount * 36 + remaining * 32; // Assuming B for rest
                const avg = totalPoints / (coursesNeeded * 4);

                if (Math.abs(avg - requiredAvg) < 1) {
                    recommendations.push({
                        S: sCount,
                        A: aCount,
                        B: remaining,
                        C: 0,
                        averageGrade: avg.toFixed(2)
                    });
                }
            }
        }
    }

    return recommendations.slice(0, 3);
}

function displayTargetAnalysis(data) {
    const container = document.getElementById('targetAnalysisResult');

    if (!data.feasible) {
        container.innerHTML = `
            <div style="color: var(--accent-error); padding: 1rem; background: rgba(239, 68, 68, 0.1); border-radius: 0.5rem; border: 1px solid rgba(239, 68, 68, 0.3);">
                <strong>❌ Not Feasible!</strong><br>
                The target CGPA cannot be achieved with the remaining ${data.remainingCredits} credits.
                <br><small>Consider setting a more realistic target.</small>
            </div>
        `;
        return;
    }

    let html = `
        <div style="padding: 1rem; background: var(--bg-card); border-radius: 0.5rem; border: 1px solid var(--border-primary);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.75rem; margin-bottom: 1rem;">
                <div>
                    <div class="text-xs text-secondary">Current CGPA</div>
                    <div class="font-bold" style="color: var(--accent-primary);">${data.currentCGPA}</div>
                </div>
                <div>
                    <div class="text-xs text-secondary">Target CGPA</div>
                    <div class="font-bold" style="color: var(--accent-success);">${data.targetCGPA}</div>
                </div>
                <div>
                    <div class="text-xs text-secondary">Required Avg</div>
                    <div class="font-bold" style="color: var(--accent-warning);">${data.requiredAverageGrade}</div>
                </div>
            </div>
    `;

    if (data.recommendations && data.recommendations.length > 0) {
        html += `<div style="margin-top: 1rem;"><strong class="text-sm">💡 Recommended Grade Combinations:</strong></div>`;
        data.recommendations.forEach((rec, index) => {
            html += `
                <div style="padding: 0.5rem; background: var(--bg-hover); border-radius: 0.375rem; margin-top: 0.5rem; font-size: 0.875rem;">
                    <strong>Option ${index + 1}:</strong> 
                    ${rec.S} S grades, ${rec.A} A grades, ${rec.B} B grades, ${rec.C || 0} C grades
                    <span style="color: var(--text-secondary);">(Avg: ${rec.averageGrade})</span>
                </div>
            `;
        });
    }

    html += '</div>';
    container.innerHTML = html;
}

// What-If Analysis Functions
function initializeWhatIfAnalysis() {
    whatIfCourses = [];
    updateWhatIfInputs();
}

function addWhatIfCourse() {
    whatIfCourses.push({
        id: Date.now(),
        name: '',
        credits: 4,
        grade: 'A'
    });
    updateWhatIfInputs();
}

function removeWhatIfCourse(id) {
    whatIfCourses = whatIfCourses.filter(course => course.id !== id);
    updateWhatIfInputs();
    calculateWhatIf();
}

function updateWhatIfInputs() {
    const container = document.getElementById('whatIfInputs');
    if (!container) return;

    container.innerHTML = '';

    whatIfCourses.forEach((course, index) => {
        const div = document.createElement('div');
        div.className = 'whatif-input-row';
        div.innerHTML = `
            <input type="text" class="whatif-course-input" placeholder="Course name (optional)" 
                   value="${course.name}" onchange="updateWhatIfCourse(${course.id}, 'name', this.value)">
            <input type="number" class="whatif-course-input" min="1" max="10" value="${course.credits}"
                   onchange="updateWhatIfCourse(${course.id}, 'credits', parseInt(this.value))">
            <div class="custom-dropdown whatif-dropdown ${course.grade ? `grade-${course.grade.toLowerCase()}` : ''}" data-course-id="${course.id}">
                <div class="dropdown-selected">
                    <span class="selected-text">${course.grade || 'A'}</span>
                    <span class="dropdown-arrow">▼</span>
                </div>
                <div class="dropdown-options">
                    <div class="dropdown-option" data-value="S">S</div>
                    <div class="dropdown-option" data-value="A">A</div>
                    <div class="dropdown-option" data-value="B">B</div>
                    <div class="dropdown-option" data-value="C">C</div>
                    <div class="dropdown-option" data-value="D">D</div>
                    <div class="dropdown-option" data-value="E">E</div>
                </div>
            </div>
            <button class="whatif-remove" onclick="removeWhatIfCourse(${course.id})">×</button>
        `;

        // Add dropdown functionality
        const dropdown = div.querySelector('.custom-dropdown');
        const selectedText = dropdown.querySelector('.selected-text');
        const options = dropdown.querySelectorAll('.dropdown-option');

        options.forEach(option => {
            option.addEventListener('click', () => {
                const value = option.dataset.value;
                selectedText.textContent = value;
                dropdown.className = `custom-dropdown whatif-dropdown ${value ? `grade-${value.toLowerCase()}` : ''}`;
                updateWhatIfCourse(course.id, 'grade', value);
            });
        });

        // Toggle dropdown
        dropdown.querySelector('.dropdown-selected').addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('open');
        });

        container.appendChild(div);
    });

    calculateWhatIf();
}

window.updateWhatIfCourse = function (id, field, value) {
    const course = whatIfCourses.find(c => c.id === id);
    if (course) {
        course[field] = value;
        calculateWhatIf();
    }
};

function calculateWhatIf() {
    if (whatIfCourses.length === 0) {
        document.getElementById('whatIfResults').innerHTML = '';
        return;
    }

    const currentStats = calculateCurrentStats();
    let newTotalPoints = currentStats.totalGradePoints;
    let newTotalCredits = currentStats.completedCredits;

    whatIfCourses.forEach(course => {
        newTotalPoints += gradeScale[course.grade] * course.credits;
        newTotalCredits += course.credits;
    });

    const newCGPA = (newTotalPoints / newTotalCredits).toFixed(2);
    const cgpaChange = (newCGPA - parseFloat(currentStats.cgpa)).toFixed(2);

    const resultsDiv = document.getElementById('whatIfResults');
    resultsDiv.innerHTML = `
        <div style="padding: 1rem; background: var(--bg-card); border-radius: 0.5rem; border: 1px solid var(--border-primary);">
            <h4 style="margin-bottom: 0.75rem; color: var(--text-primary);">📊 What-If Results</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 0.75rem;">
                <div>
                    <div class="text-xs text-secondary">Current CGPA</div>
                    <div class="font-bold" style="color: var(--accent-primary);">${currentStats.cgpa}</div>
                </div>
                <div>
                    <div class="text-xs text-secondary">Projected CGPA</div>
                    <div class="font-bold" style="color: var(--accent-success);">${newCGPA}</div>
                </div>
                <div>
                    <div class="text-xs text-secondary">CGPA Change</div>
                    <div class="font-bold" style="color: ${cgpaChange >= 0 ? 'var(--accent-success)' : 'var(--accent-error)'};">
                        ${cgpaChange >= 0 ? '+' : ''}${cgpaChange}
                    </div>
                </div>
                <div>
                    <div class="text-xs text-secondary">Added Credits</div>
                    <div class="font-bold">${whatIfCourses.reduce((sum, c) => sum + c.credits, 0)}</div>
                </div>
            </div>
        </div>
    `;
}



// Auto-save functionality
function startAutoSave() {
    if (autoSaveInterval) clearInterval(autoSaveInterval);

    autoSaveInterval = setInterval(() => {
        if (currentUser) {
            saveUserData();
        }
    }, 60000); // Save every 60 seconds (reduced frequency)
}

function stopAutoSave() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
        autoSaveInterval = null;
    }
}

async function saveUserData(showNotification = false) {
    if (!currentUser) return false;

    try {
        const token = getStoredToken();
        if (!token) {
            if (showNotification) showToast('Authentication required', 'error');
            return false;
        }

        const dataToSave = {
            courses: userData.courses || {},
            electives: userData.electives || [],
            targetCGPA: userData.targetCGPA || null,
            cgpaHistory: userData.cgpaHistory || []
        };

        console.log('Saving:', dataToSave);

        const response = await fetch(`${API_BASE_URL}/user/data`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userData: dataToSave })
        });

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                if (showNotification) showToast('Saved!', 'success');
                return true;
            }
        } else if (response.status === 401) {
            logout();
        }
        return false;
    } catch (error) {
        console.error('Save error:', error);
        if (showNotification) showToast('Save failed', 'error');
        return false;
    }
}

async function saveUserDataWithRetry(showNotification = false, retries = 3) {
    for (let i = 0; i < retries; i++) {
        const success = await saveUserData(showNotification && i === retries - 1);
        if (success) return true;

        if (i < retries - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
        }
    }
    return false;
}

async function manualSave() {
    if (!currentUser) {
        showToast('Please login first', 'error');
        return false;
    }

    updateSaveButtonState('saving');

    try {
        const success = await saveUserData(true);
        if (success) {
            setTimeout(() => updateSaveButtonState('default'), 2000);
            return true;
        } else {
            updateSaveButtonState('error');
            setTimeout(() => updateSaveButtonState('default'), 3000);
            return false;
        }
    } catch (error) {
        console.error('Manual save error:', error);
        updateSaveButtonState('error');
        showToast(`Save failed: ${error.message}`, 'error');
        setTimeout(() => updateSaveButtonState('default'), 3000);
        return false;
    }
}

function updateSaveButtonState(state) {
    const saveBtn = document.getElementById('saveBtn');
    const saveText = document.getElementById('saveText');

    if (!saveBtn || !saveText) return;

    saveBtn.className = 'save-btn';

    switch (state) {
        case 'saving':
            saveBtn.classList.add('saving');
            saveText.textContent = 'Saving...';
            saveBtn.disabled = true;
            break;
        case 'saved':
            saveBtn.classList.add('saved');
            saveText.textContent = 'Saved!';
            saveBtn.disabled = false;
            break;
        case 'error':
            saveBtn.style.background = 'var(--accent-error)';
            saveText.textContent = 'Error';
            saveBtn.disabled = false;
            break;
        default:
            saveText.textContent = 'Save';
            saveBtn.disabled = false;
            saveBtn.style.background = '';
    }
}

function logout() {
    stopAutoSave();
    removeStoredToken();
    currentUser = null;
    userData = {
        courses: {},
        electives: [],
        targetCGPA: null,
        cgpaHistory: []
    };
    whatIfCourses = [];



    showLoginPage();
    showToast('Logged out successfully', 'success');
}

// Utility Functions
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showLoader(textId, loaderId) {
    const textEl = document.getElementById(textId);
    const loaderEl = document.getElementById(loaderId);

    if (textEl) textEl.style.display = 'none';
    if (loaderEl) loaderEl.style.display = 'inline-block';
}

function hideLoader(textId, loaderId) {
    const textEl = document.getElementById(textId);
    const loaderEl = document.getElementById(loaderId);

    if (textEl) textEl.style.display = 'inline';
    if (loaderEl) loaderEl.style.display = 'none';
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveUserData();
        showToast('Data saved manually', 'success');
    }




}

// Request notification permission on first load
document.addEventListener('DOMContentLoaded', () => {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
});

// Handle page visibility for auto-save
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden - save data
        if (currentUser) {
            saveUserData();
        }
    }
});

// Handle online/offline status
function updateConnectionStatus() {
    const status = document.getElementById('connectionStatus');
    if (!status) return;

    if (navigator.onLine) {
        status.textContent = 'Connected';
        status.className = 'connection-status online';
        setTimeout(() => {
            status.classList.remove('show');
        }, 2000);
    } else {
        status.textContent = 'Offline - Changes saved locally';
        status.className = 'connection-status offline show';
    }
}

window.addEventListener('online', () => {
    updateConnectionStatus();
    showToast('Connection restored', 'success');
    if (currentUser) {
        saveUserData(false); // Sync any pending changes
    }
});

window.addEventListener('offline', () => {
    updateConnectionStatus();
    showToast('Working offline', 'info');
});

// Check initial connection status
document.addEventListener('DOMContentLoaded', () => {
    if (!navigator.onLine) {
        updateConnectionStatus();
    }
});

// Progressive Web App installation
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Could show an install button here
    console.log('PWA install prompt available');
});

window.addEventListener('appinstalled', (e) => {
    showToast('StudyMetrics installed successfully!', 'success');
    deferredPrompt = null;
});





// Analytics helper functions
function getGradeCount(grade) {
    return Object.values(userData.courses).filter(course => course.grade === grade).length;
}

function getTotalCompletedCourses() {
    return Object.values(userData.courses).filter(course => course.grade).length;
}

function getSectionProgress(section) {
    const sectionCourses = Object.entries(userData.courses).filter(([courseId]) =>
        courseId.startsWith(section)
    );

    const completed = sectionCourses.filter(([_, data]) => data.grade).length;
    let total = 0;

    switch (section) {
        case 'foundation':
            total = courseDatabase.foundation.courses.length;
            break;
        case 'programming':
            total = courseDatabase.diploma.programming.courses.length;
            break;
        case 'dataScience':
            total = courseDatabase.diploma.dataScience.courses.length + 2; // including optional
            break;
        case 'degreeCore':
            total = courseDatabase.degree.core.courses.length;
            break;
        case 'elective':
            total = userData.electives.length;
            break;
    }

    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
}



// Accessibility improvements
document.addEventListener('keydown', (e) => {
    // Tab navigation enhancement
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Add focus trap for modals
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }

        if (e.key === 'Escape') {
            hideElectiveModal();
        }
    });
}

// Initialize focus trap when modal opens
const originalShowElectiveModal = showElectiveModal;
showElectiveModal = function () {
    originalShowElectiveModal();
    const modal = document.getElementById('electiveModal');
    trapFocus(modal.querySelector('.modal-content'));
};

// Theme detection and handling
function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
    }
    return 'dark';
}

// Handle system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (e.matches) {
        console.log('System switched to dark theme');
    } else {
        console.log('System switched to light theme');
    }
});

// Service Worker update handling
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SKIP_WAITING') {
            window.location.reload();
        } else if (event.data && event.data.type === 'CACHE_UPDATED') {
            console.log('Cache updated to version:', event.data.version);
            showToast('App updated successfully!', 'success');
        }
    });
}

// Cleanup on page unload
window.addEventListener('beforeunload', (e) => {
    if (currentUser) {
        // Save using fetch with keepalive for auth support
        const token = getStoredToken();
        if (token) {
            fetch(`${API_BASE_URL}/user/data`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userData: userData }),
                keepalive: true
            });
        }
    }

    // Clear intervals
    stopAutoSave();

});

// Initialize smooth scrolling for anchor links
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Lazy loading for images (if any are added later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    // Observe lazy images when added
    const observeLazyImages = () => {
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    };

    // Call initially and set up mutation observer for dynamic content
    observeLazyImages();

    const mutationObserver = new MutationObserver(observeLazyImages);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
}

// Debug function for troubleshooting
window.debugStudyMetrics = function () {
    console.log('=== StudyMetrics Debug Info ===');
    console.log('Current User:', currentUser);
    console.log('User Data:', userData);
    console.log('Token:', getStoredToken() ? 'Present' : 'Missing');
    console.log('API Base URL:', API_BASE_URL);
    console.log('Course Database:', {
        foundation: courseDatabase.foundation?.courses?.length || 0,
        programming: courseDatabase.diploma?.programming?.courses?.length || 0,
        dataScience: courseDatabase.diploma?.dataScience?.courses?.length || 0,
        degreeCore: courseDatabase.degree?.core?.courses?.length || 0,
        electives: courseDatabase.degree?.electives?.length || 0
    });
    console.log('DOM Elements:', {
        mainApp: !!document.getElementById('mainApp'),
        foundationCourses: !!document.getElementById('foundationCourses'),
        programmingCourses: !!document.getElementById('programmingCourses'),
        dataScienceCourses: !!document.getElementById('dataScienceCourses'),
        degreeCourses: !!document.getElementById('degreeCourses'),
        electiveCourses: !!document.getElementById('electiveCourses')
    });
    console.log('===============================');
};

window.calculateTargetCGPA = calculateTargetCGPA;
window.addWhatIfCourse = addWhatIfCourse;
window.removeWhatIfCourse = removeWhatIfCourse;
window.updateWhatIfCourse = updateWhatIfCourse;
window.calculateWhatIf = calculateWhatIf;

// Grade Predictor Logic
let predictorState = {
    level: 'foundation',
    course: null,
    inputs: {},
    endTermAttempted: false
};

function initGradePredictor() {
    console.log('Initializing Grade Predictor...');

    // Setup Level Select
    const levelSelect = document.getElementById('predictorLevelSelect');
    if (levelSelect) {
        levelSelect.addEventListener('change', (e) => setPredictorLevel(e.target.value));
    }

    // Setup Course Dropdown
    const courseSelect = document.getElementById('predictorCourseSelect');
    courseSelect.addEventListener('change', (e) => selectPredictorCourse(e.target.value));

    // Setup Toggle
    const toggle = document.getElementById('endTermToggle');
    toggle.addEventListener('change', (e) => {
        predictorState.endTermAttempted = e.target.checked;

        // Update Toggle Color
        if (e.target.checked) {
            document.documentElement.style.setProperty('--toggle-active', 'var(--accent-success)');
        } else {
            document.documentElement.style.setProperty('--toggle-active', 'var(--accent-primary)');
        }

        renderPredictorInputs();
    });

    // Initial Population
    setPredictorLevel('foundation');
}

function setPredictorLevel(level) {
    predictorState.level = level;

    // Update UI
    // Update Select Value
    const levelSelect = document.getElementById('predictorLevelSelect');
    if (levelSelect && levelSelect.value !== level) levelSelect.value = level;

    // Populate Dropdown
    const select = document.getElementById('predictorCourseSelect');
    select.innerHTML = '<option value="">Select a course...</option>';

    const courses = gradePredictorData.levels[level] || [];

    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.course; // Using 'course' property from new JSON
        option.textContent = course.course;
        select.appendChild(option);
    });
}

function selectPredictorCourse(courseName) {
    if (!courseName) {
        predictorState.course = null;
        document.getElementById('predictorInputs').innerHTML = '<div class="text-center text-muted" style="padding: 2rem;">Select a course to begin</div>';
        return;
    }

    predictorState.course = gradePredictorData.levels[predictorState.level]?.find(c => c.course === courseName);
    predictorState.inputs = {}; // Reset inputs

    renderPredictorInputs();
}

function renderPredictorInputs() {
    if (!predictorState.course) return;

    const container = document.getElementById('predictorInputs');
    container.innerHTML = '';

    // Determine inputs for this course. 
    // We can infer from formula or use provided inputs list. User provided inputs list!
    // Parse inputs from formula string
    const formula = predictorState.course.formula;
    // Regex to match variables (words starting with letter, excluding 'max', 'min')
    const matches = formula.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
    const keywords = ['max', 'min', 'avg'];

    // Filter unique variables that are not keywords
    let inputVars = [...new Set(matches)].filter(v => !keywords.includes(v));

    // Ensure 'bonus' is present if not already (user request: "Bonus input is not shown for many courses")
    // We only add it if it's not already covered by a specific bonus variable (like bonus_capped_5)
    // But since "bonus" is the generic one, we'll force add "bonus" if no other bonus var exists, or just validly add it.
    // simpler: Ensure "bonus" is in the list. logic later handles if it's used or not.
    if (!inputVars.includes('bonus')) {
        inputVars.push('bonus');
    }

    // Sort Inputs: Custom Order as per request
    // "End Term input should be after Quiz 2"
    // Desired Order: Quiz 1, Quiz 2, End Term (F), Bonus, [Others]
    const sortOrder = {
        'GA': 1, // User Request: "Graded Assignment Avg ... above Quiz 1"
        'GAA': 1,
        'Qz1': 2,
        'Qz2': 3,
        'F': 4,
        'bonus': 99
    };

    inputVars.sort((a, b) => {
        const orderA = sortOrder[a] || 50; // Default middle priority
        const orderB = sortOrder[b] || 50;
        if (orderA !== orderB) return orderA - orderB;
        return a.localeCompare(b); // Alphabetical for others
    });


    // Store for calculation usage
    predictorState.course.inputs = inputVars;

    inputVars.forEach(variable => {
        // Skip 'F' (End Term) if End Term NOT Attempted
        if (variable === 'F' && !predictorState.endTermAttempted) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'form-group';
        wrapper.style.marginBottom = '1.5rem';

        const labelRow = document.createElement('div');
        labelRow.style.display = 'flex';
        labelRow.style.justifyContent = 'space-between';
        labelRow.style.marginBottom = '0.5rem';

        const label = document.createElement('label');
        label.className = 'form-label';
        label.textContent = getReadableLabel(variable);

        const valueDisplay = document.createElement('span');
        valueDisplay.className = 'text-sm font-bold';
        valueDisplay.style.color = 'var(--accent-primary)';
        valueDisplay.textContent = '0';
        valueDisplay.id = `val-${variable}`;

        labelRow.appendChild(label);
        labelRow.appendChild(valueDisplay);

        const inputsRow = document.createElement('div');
        inputsRow.style.display = 'flex';
        inputsRow.style.alignItems = 'center';
        inputsRow.style.gap = '1rem';

        const isBonus = /bonus/i.test(variable);
        const maxVal = isBonus ? 10 : 100;

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = maxVal;
        slider.value = '0';
        slider.className = 'form-input';
        slider.style.padding = '0'; // Slider style
        slider.id = `slider-${variable}`;
        slider.style.flex = '1';

        const numInput = document.createElement('input');
        numInput.type = 'number';
        numInput.min = '0';
        numInput.max = maxVal;
        numInput.value = '0';
        numInput.className = 'form-input';
        numInput.style.width = '70px';
        numInput.style.padding = '0.4rem';
        numInput.id = `num-${variable}`;

        // Sync Logic
        const updateVal = (val) => {
            // Clamping
            if (val > maxVal) val = maxVal;
            if (val < 0) val = 0;

            slider.value = val;
            numInput.value = val;
            valueDisplay.textContent = val;
            predictorState.inputs[variable] = parseInt(val);
            calculatePrediction();
        };

        slider.addEventListener('input', (e) => updateVal(e.target.value));
        numInput.addEventListener('input', (e) => updateVal(e.target.value));

        inputsRow.appendChild(slider);
        inputsRow.appendChild(numInput);

        wrapper.appendChild(labelRow);
        wrapper.appendChild(inputsRow);

        container.appendChild(wrapper);

        // Initialize state
        predictorState.inputs[variable] = 0;
    });

    calculatePrediction();
}

function getReadableLabel(key) {
    const map = {
        'F': 'End Term Exam',
        'Qz1': 'Quiz 1',
        'Qz2': 'Quiz 2',
        'Qz3': 'Quiz 3',
        'GA': 'Graded Assignment Avg',
        'GAA': 'Graded Assignment Avg',
        'GAA2': 'Graded Assignment Avg 2',
        'GAA3': 'Graded Assignment Avg 3',
        'bonus': 'Bonus Marks',

        // Programming & Projects
        'PE1': 'Proctored Exam 1',
        'PE2': 'Proctored Exam 2',
        'OPPE': 'Online Proctored Programming Exam',
        'OPPE1': 'Online Proctored Programming Exam 1',
        'OPPE2': 'Online Proctored Programming Exam 2',
        'NPPE': 'Non-Proctored Programming Exam',
        'NPPE1': 'Non-Proctored Programming Exam 1',
        'NPPE2': 'Non-Proctored Programming Exam 2',
        'OP': 'Online Proctored Programming Exam',

        // Assignments & Labs
        'GLA': 'Graded Lab Assignment',
        'Prog_Asgn': 'Programming Assignment',
        'Weekly_Asgn': 'Weekly Assignment',
        'BPTA': 'Biweekly Programming Test Avg',
        'KA_avg': 'Knowledge Assessment Avg',

        // Project & Participation
        'GP': 'Group Project',
        'GP1': 'Group Project 1',
        'GP2': 'Group Project 2',
        'P1': 'Project 1',
        'P2': 'Project 2',
        'PP': 'Project Presentation',
        'CP': 'Course Participation Activity',
        'Project_Viva': 'Project Viva',
        'ROE': 'Remote Online Examination',

        // Industry 4.0 Specific
        // Industry 4.0 Specific
        'Quiz_Sum_15': 'Quiz Sum (15 Marks)',
        'Game_5': 'Online Game (5 Marks)',
        'Asgn_Best2_40': 'Best 2 Assignments (40 Marks)',
        'F': 'End Term Exam', // Standardized
        'Project_10': 'Project (10 Marks)'
    };

    // Dynamic mapping for specific user request
    if (key === 'GA_best3_of_4' || key.includes('GA_')) {
        return 'Graded Assignment Avg (Best 3 of 4)';
    }

    return map[key] || key.replace(/_/g, ' ');
}

function calculatePrediction() {
    const course = predictorState.course;
    if (!course) return;

    const resultsContainer = document.getElementById('predictorResults');
    const inputs = predictorState.inputs;

    // Prepare formula
    let formula = course.formula
        .replace(/max\(/g, 'Math.max(')
        .replace(/min\(/g, 'Math.min(');

    if (predictorState.endTermAttempted) {
        try {
            const formula = predictorState.course.formula;
            const inputs = predictorState.inputs;

            // Prepare evaluation context
            const context = {};
            predictorState.course.inputs.forEach(v => {
                if (v === 'F' && !predictorState.endTermAttempted) {
                    context[v] = 0; // F is 0 in calculation if not attempted (logic handled elsewhere usually, but safe fallback)
                } else {
                    context[v] = parseFloat(inputs[v]) || 0;
                }
            });

            // Create a safe evaluation function
            // Replace variables with 'context.VarName' using the stored inputVars list
            // We use a regex to ensure whole word replacement

            let safeFormula = formula;
            predictorState.course.inputs.forEach(v => {
                const regex = new RegExp(`\\b${v}\\b`, 'g');
                safeFormula = safeFormula.replace(regex, `context['${v}']`);
            });

            safeFormula = safeFormula.replace(/\bmax\b/g, 'Math.max');
            safeFormula = safeFormula.replace(/\bmin\b/g, 'Math.min');
            // avg is handled by context.avg

            const avg = (...args) => args.reduce((a, b) => a + b, 0) / (args.length || 1);
            context.avg = avg;

            const evalFunction = new Function('context', 'Math', `return ${safeFormula};`);
            let score = evalFunction(context, Math);

            // Add Bonus if not already part of formula
            // We search if 'bonus' (case insensitive or whatever) was in the original formula logic.
            // But strict 'bonus' variable was added to inputs.
            // If the formula didn't reference the 'bonus' variable, we simply add it to the final score.
            // Many formulas are just 'max(...)' without bonus.
            const formulaHasBonus = /\bbonus\b/.test(formula);
            if (!formulaHasBonus && inputs.bonus) {
                score += inputs.bonus;
            }

            const grade = calculateGradeFromScore(score);

            resultsContainer.innerHTML = `
            <div class="text-center" style="padding: 2rem;">
                <div class="text-secondary text-sm mb-2">Total Course Score</div>
                <div class="cgpa-value">${score.toFixed(2)}</div>
                <div class="text-lg font-bold" style="color: ${getGradeColor(grade)}; margin-top: 1rem;">${grade} Grade</div>
            </div>
        `;

        } catch (e) {
            console.error('Calculation error:', e);
            resultsContainer.innerHTML = '<div class="text-error text-center p-4">Error in calculation formula</div>';
        }

    } else {
        try {
            // Backward Calculation
            let html = '<table style="width:100%; text-align: left;">';
            html += '<thead><tr><th style="padding:8px; color:var(--text-secondary);">Grade</th><th style="padding:8px; color:var(--text-secondary);">Required in End Term (F)</th></tr></thead><tbody>';

            const grades = ['S', 'A', 'B', 'C', 'D', 'E'];

            // Prepare context with known inputs
            // Similar to forward calc, we need to handle variable replacement in findRequiredF properly

            grades.forEach(g => {
                const cutoff = gradePredictorData.cutoffs[g];
                const requiredF = findRequiredF(course, inputs, cutoff);

                let displayF = '';
                if (requiredF === null) displayF = '<span style="color:var(--accent-error)">Unviable</span>';
                else if (requiredF <= 0) displayF = '<span style="color:var(--accent-success)">Already Achieved</span>';
                else displayF = `<span style="font-weight:bold; color:var(--text-primary)">${Math.ceil(requiredF)}%</span>`;

                const color = getGradeColor(g);

                html += `<tr>
                    <td style="padding:12px 8px; font-weight:bold; color:${color}">
                        <div style="background:${color}; color:white; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:14px; box-shadow:0 2px 5px rgba(0,0,0,0.2);">${g[0]}</div>
                    </td>
                    <td style="padding:12px 8px;">${displayF}</td>
                </tr>`;
            });

            html += '</tbody></table>';
            resultsContainer.innerHTML = html;
        } catch (e) {
            console.error('Backward calc error:', e);
            resultsContainer.innerHTML = '<div class="text-error text-center p-4">Error calculating required scores</div>';
        }
    }
}

function findRequiredF(course, currentInputs, targetScore) {
    // Binary/Linear Search for F (0-100)
    // Formula is max(..., ...) usually linear with F.

    // Create function to eval
    let formula = course.formula
        .replace(/max\(/g, 'Math.max(')
        .replace(/min\(/g, 'Math.min(');
    const argNames = course.inputs; // Includes 'F'
    const avg = (...args) => args.reduce((a, b) => a + b, 0) / (args.length || 1);
    const func = new Function(...argNames, 'avg', 'return ' + formula);

    const callFunc = (inputsObj) => {
        const args = argNames.map(n => inputsObj[n] !== undefined ? inputsObj[n] : 0);
        return func(...args, avg);
    };

    // Check max possible
    const inputsMax = { ...currentInputs, F: 100 };
    const maxScore = callFunc(inputsMax);

    if (maxScore < targetScore) return null;

    // Check if already achieved with 0
    const inputsMin = { ...currentInputs, F: 0 };
    const minScore = callFunc(inputsMin);
    if (minScore >= targetScore) return 0;

    // Search
    let low = 0, high = 100;
    for (let i = 0; i < 20; i++) {
        let mid = (low + high) / 2;
        const inputsMid = { ...currentInputs, F: mid };
        const s = callFunc(inputsMid);

        if (s >= targetScore) {
            high = mid;
        } else {
            low = mid;
        }
    }
    return high;
}

function calculateGradeFromScore(score) {
    if (score >= 90) return 'S';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    if (score >= 40) return 'E';
    return 'U';
}

function getGradeColor(g) {
    const map = {
        'S': 'var(--grade-s)',
        'A': 'var(--grade-a)',
        'B': 'var(--grade-b)',
        'C': 'var(--grade-c)',
        'D': 'var(--grade-d)',
        'E': 'var(--grade-e)',
        'U': 'var(--accent-error)'
    };
    return map[g] || 'white';
}

// Window exports
window.initGradePredictor = initGradePredictor;
window.setPredictorLevel = setPredictorLevel;
window.calculatePrediction = calculatePrediction;
window.addWhatIfCourse = addWhatIfCourse;

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}