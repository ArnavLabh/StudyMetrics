// Check if Chart.js is loaded
function ensureChartJS() {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded. Please ensure the Chart.js CDN is included.');
        return false;
    }
    return true;
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
                { name: "Tools in Data Science", code: "BSSE2002", credits: 3 }
            ],
            optionalCourses: [
                { 
                    primary: { name: "Business Analytics", code: "BSMS2002", credits: 4 },
                    alternative: { name: "Introduction to Deep Learning", code: "BSCS2009", credits: 4 }
                },
                { 
                    primary: { name: "Business Data Management - Project", code: "BSMS2001P", credits: 2 },
                    alternative: { name: "Introduction to Deep Learning - Project", code: "BSCS2009P", credits: 2 }
                }
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

// Application State
let currentUser = null;
let userData = {
    courses: {},
    electives: [],
    dataScienceOptions: {
        analytics: true,
        project: true
    },
    targetCGPA: null,
    cgpaHistory: []
};

let whatIfCourses = [];
let autoSaveInterval = null;
let isRegistering = false;

// Timer State
let timerState = {
    isRunning: false,
    isBreak: false,
    timeLeft: 25 * 60, // 25 minutes in seconds
    studyDuration: 25 * 60,
    breakDuration: 5 * 60,
    currentCourse: '',
    currentActivity: '',
    interval: null,
    sessions: []
};

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
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            console.log('Service Worker registered:', registration);
            
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
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            showToast('New version available! Refreshing...', 'info');
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        });
    }
}

function initializeApp() {
    console.log('Initializing app...');
    const token = getStoredToken();
    if (token) {
        verifyAndLoadUser(token);
    } else {
        showLoginPage();
    }
    
    setupEventListeners();
    initializeTimer();
    
    // Ensure courses are rendered even if API calls fail
    setTimeout(() => {
        if (document.getElementById('mainApp').style.display !== 'none' && !userData.courses) {
            console.log('Fallback: Rendering courses after timeout...');
            userData = {
                courses: {},
                electives: [],
                dataScienceOptions: { analytics: true, project: true },
                targetCGPA: null,
                cgpaHistory: []
            };
            renderAllCourses();
        }
    }, 3000); // 3 second fallback
}

// Enhanced token management
function getStoredToken() {
    return localStorage.getItem('studymetrics_token') || sessionStorage.getItem('studymetrics_token');
}

function storeToken(token, remember = true) {
    if (remember) {
        localStorage.setItem('studymetrics_token', token);
        sessionStorage.removeItem('studymetrics_token');
    } else {
        sessionStorage.setItem('studymetrics_token', token);
        localStorage.removeItem('studymetrics_token');
    }
}

function removeStoredToken() {
    localStorage.removeItem('studymetrics_token');
    sessionStorage.removeItem('studymetrics_token');
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

    // Timer controls
    document.getElementById('startTimer')?.addEventListener('click', startTimer);
    document.getElementById('pauseTimer')?.addEventListener('click', pauseTimer);
    document.getElementById('resetTimer')?.addEventListener('click', resetTimer);
    
    // Timer settings
    document.getElementById('studyDuration')?.addEventListener('change', updateTimerSettings);
    document.getElementById('breakDuration')?.addEventListener('change', updateTimerSettings);

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
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const section = tab.dataset.section;
            switchSection(section);
            
            // Update URL without page reload
            history.pushState(null, null, `#${section}`);
        });
    });

    // Handle back/forward browser navigation
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.slice(1) || 'dashboard';
        switchSection(hash);
    });

    // Handle direct navigation
    const initialSection = window.location.hash.slice(1) || 'dashboard';
    if (['dashboard', 'analytics', 'timer'].includes(initialSection)) {
        switchSection(initialSection);
    }
}

function toggleAuthMode() {
    isRegistering = !isRegistering;
    updateAuthUI();
}

function updateAuthUI() {
    const btnText = document.getElementById('authBtnText');
    const toggleLink = document.getElementById('toggleAuth');
    const subtitle = document.querySelector('.login-subtitle');
    
    if (isRegistering) {
        btnText.textContent = 'Create Account';
        toggleLink.textContent = 'Login instead';
        subtitle.textContent = 'Create your account to get started';
    } else {
        btnText.textContent = 'Login';
        toggleLink.textContent = 'Create one';
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
            
            // Load user data in background, but render courses immediately
            loadUserData().catch(error => {
                console.error('Failed to load user data, but continuing with empty data:', error);
                // Ensure courses are rendered even if loadUserData fails
                if (!userData.courses) {
                    userData = {
                        courses: {},
                        electives: [],
                        dataScienceOptions: { analytics: true, project: true },
                        targetCGPA: null,
                        cgpaHistory: []
                    };
                    renderAllCourses();
                }
            });
            
            showToast(isRegistering ? 'Account created successfully!' : 'Welcome back!', 'success');
        } else {
            console.error('Authentication failed:', data);
            showToast(data.message || 'Authentication failed', 'error');
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
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('User verified:', data.user);
            currentUser = data.user;
            showMainApp();
            
            // Load user data in background, but render courses immediately
            loadUserData().catch(error => {
                console.error('Failed to load user data, but continuing with empty data:', error);
                // Ensure courses are rendered even if loadUserData fails
                if (!userData.courses) {
                    userData = {
                        courses: {},
                        electives: [],
                        dataScienceOptions: { analytics: true, project: true },
                        targetCGPA: null,
                        cgpaHistory: []
                    };
                    renderAllCourses();
                }
            });
        } else {
            console.error('Token verification failed - response not ok:', response.status);
            removeStoredToken();
            showLoginPage();
        }
    } catch (error) {
        console.error('Token verification failed:', error);
        removeStoredToken();
        showLoginPage();
    }
}

function showLoginPage() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
    document.body.style.overflow = 'hidden';
}

function showMainApp() {
    console.log('Showing main app...');
    
    const loginPage = document.getElementById('loginPage');
    const mainApp = document.getElementById('mainApp');
    
    if (!loginPage || !mainApp) {
        console.error('Required DOM elements not found');
        return;
    }
    
    loginPage.style.display = 'none';
    mainApp.style.display = 'block';
    document.body.style.overflow = 'auto';
    
    // Update user info
    const avatar = document.getElementById('userAvatar');
    const welcome = document.getElementById('welcomeMessage');
    
    if (avatar && welcome && currentUser) {
        avatar.textContent = currentUser.username[0].toUpperCase();
        welcome.textContent = `Welcome back, ${currentUser.username}`;
    }
    
    startAutoSave();
    populateTimerCourses();
    
    // Ensure courses are rendered even if loadUserData fails
    if (!userData.courses) {
        console.log('Initializing empty user data and rendering courses...');
        userData = {
            courses: {},
            electives: [],
            dataScienceOptions: { analytics: true, project: true },
            targetCGPA: null,
            cgpaHistory: []
        };
        renderAllCourses();
    }
    
    // Initialize charts after a short delay to ensure DOM is ready
    setTimeout(() => {
        updateGradeDistribution();
    }, 500);
    
    console.log('Main app shown successfully');
}

async function loadUserData() {
    try {
        console.log('Loading user data...');
        const token = getStoredToken();
        
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(`${API_BASE_URL}/user/data`, {
            headers: { 'Authorization': `Bearer ${token}` },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            console.log('User data loaded:', data);
            
            userData = {
                courses: data.userData?.courses || {},
                electives: data.userData?.electives || [],
                dataScienceOptions: data.userData?.dataScienceOptions || { analytics: true, project: true },
                targetCGPA: data.userData?.targetCGPA || null,
                cgpaHistory: data.userData?.cgpaHistory || []
            };
            
            // Load target CGPA input
            const targetInput = document.getElementById('targetCgpaInput');
            if (targetInput && userData.targetCGPA) {
                targetInput.value = userData.targetCGPA;
            }
            
            console.log('About to render all courses...');
            renderAllCourses();
            updateAnalytics();
            updateCGPAHistory();
            
            // Initialize charts after user data is loaded
            setTimeout(() => {
                updateGradeDistribution();
            }, 200);
        } else {
            console.error('Failed to load user data - response not ok:', response.status);
            // Even if API fails, render courses with empty data
            userData = {
                courses: {},
                electives: [],
                dataScienceOptions: { analytics: true, project: true },
                targetCGPA: null,
                cgpaHistory: []
            };
            renderAllCourses();
            
            // Initialize charts after user data is loaded
            setTimeout(() => {
                updateGradeDistribution();
            }, 200);
        }
    } catch (error) {
        console.error('Failed to load user data:', error);
        showToast('Failed to load your data', 'error');
        
        // Even if there's an error, render courses with empty data
        userData = {
            courses: {},
            electives: [],
            dataScienceOptions: { analytics: true, project: true },
            targetCGPA: null,
            cgpaHistory: []
        };
        renderAllCourses();
        
        // Initialize charts after user data is loaded
        setTimeout(() => {
            updateGradeDistribution();
        }, 200);
    }
}

function renderAllCourses() {
    try {
        console.log('Rendering all courses...');
        
        // Check if main app is visible
        const mainApp = document.getElementById('mainApp');
        if (!mainApp || mainApp.style.display === 'none') {
            console.log('Main app not visible, deferring course rendering...');
            setTimeout(() => renderAllCourses(), 100);
            return;
        }
        
        // Check if dashboard section is visible
        const dashboardSection = document.getElementById('dashboardSection');
        if (!dashboardSection || dashboardSection.style.display === 'none') {
            console.log('Dashboard section not visible, deferring course rendering...');
            setTimeout(() => renderAllCourses(), 100);
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
        
        // Check if course database is properly loaded
        if (!courseDatabase || !courseDatabase.foundation || !courseDatabase.diploma || !courseDatabase.degree) {
            console.error('Course database not properly loaded');
            showToast('Course data not available', 'error');
            return;
        }
        
        // Check if course database has the expected structure
        if (!courseDatabase.foundation.courses || !courseDatabase.diploma.programming.courses || 
            !courseDatabase.diploma.dataScience.courses || !courseDatabase.degree.core.courses || 
            !courseDatabase.degree.electives) {
            console.error('Course database missing expected structure');
            showToast('Course data structure is invalid', 'error');
            return;
        }
        
        // Check if course database has courses in each section
        if (courseDatabase.foundation.courses.length === 0 || 
            courseDatabase.diploma.programming.courses.length === 0 || 
            courseDatabase.diploma.dataScience.courses.length === 0 || 
            courseDatabase.degree.core.courses.length === 0) {
            console.error('Course database has empty sections');
            showToast('Course data is incomplete', 'error');
            return;
        }
        
        // Check if course database has the expected number of courses
        const expectedCourses = {
            foundation: 8,
            programming: 8,
            dataScience: 6,
            degreeCore: 5
        };
        
        if (courseDatabase.foundation.courses.length !== expectedCourses.foundation ||
            courseDatabase.diploma.programming.courses.length !== expectedCourses.programming ||
            courseDatabase.diploma.dataScience.courses.length !== expectedCourses.dataScience ||
            courseDatabase.degree.core.courses.length !== expectedCourses.degreeCore) {
            console.warn('Course database has unexpected number of courses:', {
                foundation: courseDatabase.foundation.courses.length,
                programming: courseDatabase.diploma.programming.courses.length,
                dataScience: courseDatabase.diploma.dataScience.courses.length,
                degreeCore: courseDatabase.degree.core.courses.length
            });
        }
        
        // Check if course database has the expected course structure
        const sampleCourse = courseDatabase.foundation.courses[0];
        if (!sampleCourse || !sampleCourse.name || !sampleCourse.code || !sampleCourse.credits) {
            console.error('Course database has invalid course structure');
            showToast('Course data structure is invalid', 'error');
            return;
        }
        
        // Check if all courses have the required fields
        const allCourses = [
            ...courseDatabase.foundation.courses,
            ...courseDatabase.diploma.programming.courses,
            ...courseDatabase.diploma.dataScience.courses,
            ...courseDatabase.degree.core.courses
        ];
        
        const invalidCourses = allCourses.filter(course => !course.name || !course.code || !course.credits);
        if (invalidCourses.length > 0) {
            console.error('Found courses with missing required fields:', invalidCourses);
            showToast('Some courses have invalid data', 'error');
            return;
        }
        
        // Check if all courses have valid credit values
        const invalidCredits = allCourses.filter(course => !Number.isInteger(course.credits) || course.credits <= 0);
        if (invalidCredits.length > 0) {
            console.error('Found courses with invalid credit values:', invalidCredits);
            showToast('Some courses have invalid credit values', 'error');
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
        
        // Initialize charts after courses are rendered
        setTimeout(() => {
            updateGradeDistribution();
        }, 100);
        
        console.log('All courses rendered successfully');
    } catch (error) {
        console.error('Error rendering courses:', error);
        showToast('Error loading course data', 'error');
    }
}

function renderCourseList(containerId, courses, section) {
    console.log(`Attempting to render ${containerId} with ${courses?.length || 0} courses`);
    
    // Check if DOM is ready
    if (document.readyState !== 'complete') {
        console.log('DOM not ready, deferring course rendering...');
        setTimeout(() => renderCourseList(containerId, courses, section), 100);
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
    
    // Render all fixed courses
    courseDatabase.diploma.dataScience.courses.forEach((course, index) => {
        const courseCard = createCourseCard(course, 'dataScience', index);
        container.appendChild(courseCard);
    });
    
    // Render all optional courses
    const optionalCourses = courseDatabase.diploma.dataScience.optionalCourses;
    
    // Business Analytics course
    const analyticsCard = createCourseCard(optionalCourses[0].primary, 'dataScience', 'opt-analytics');
    container.appendChild(analyticsCard);
    
    // Deep Learning course
    const dlCard = createCourseCard(optionalCourses[0].alternative, 'dataScience', 'opt-dl');
    container.appendChild(dlCard);
    
    // Business Analytics Project
    const analyticsProjectCard = createCourseCard(optionalCourses[1].primary, 'dataScience', 'opt-analytics-project');
    container.appendChild(analyticsProjectCard);
    
    // Deep Learning Project
    const dlProjectCard = createCourseCard(optionalCourses[1].alternative, 'dataScience', 'opt-dl-project');
    container.appendChild(dlProjectCard);
    
    // Apply disabling logic
    updateDataScienceCourseStates();
}

function updateDataScienceCourseStates() {
    // Check if Business Analytics track is selected
    const hasAnalyticsGrade = userData.courses['dataScience-opt-analytics']?.grade;
    const hasAnalyticsProjectGrade = userData.courses['dataScience-opt-analytics-project']?.grade;
    
    // Check if Deep Learning track is selected
    const hasDLGrade = userData.courses['dataScience-opt-dl']?.grade;
    const hasDLProjectGrade = userData.courses['dataScience-opt-dl-project']?.grade;
    
    // Disable courses based on selections
    const analyticsCard = document.querySelector('[data-course-id="dataScience-opt-analytics"]');
    const dlCard = document.querySelector('[data-course-id="dataScience-opt-dl"]');
    const analyticsProjectCard = document.querySelector('[data-course-id="dataScience-opt-analytics-project"]');
    const dlProjectCard = document.querySelector('[data-course-id="dataScience-opt-dl-project"]');
    
    if (hasDLGrade || hasDLProjectGrade) {
        // Deep Learning track selected, disable Business Analytics courses
        if (analyticsCard) analyticsCard.classList.add('disabled');
        if (analyticsProjectCard) analyticsProjectCard.classList.add('disabled');
    } else {
        if (analyticsCard) analyticsCard.classList.remove('disabled');
        if (analyticsProjectCard) analyticsProjectCard.classList.remove('disabled');
    }
    
    if (hasAnalyticsGrade || hasAnalyticsProjectGrade) {
        // Business Analytics track selected, disable Deep Learning courses
        if (dlCard) dlCard.classList.add('disabled');
        if (dlProjectCard) dlProjectCard.classList.add('disabled');
    } else {
        if (dlCard) dlCard.classList.remove('disabled');
        if (dlProjectCard) dlProjectCard.classList.remove('disabled');
    }
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
            <div class="grade-select-wrapper">
                <div class="custom-dropdown ${grade ? `grade-${grade.toLowerCase()}` : ''}" data-course-id="${section}-${index}">
                    <div class="dropdown-selected">
                        <span class="selected-text">${grade || '-'}</span>
                        <span class="dropdown-arrow">▼</span>
                    </div>
                    <div class="dropdown-options">
                        <div class="dropdown-option" data-value="">-</div>
                        <div class="dropdown-option" data-value="S">S</div>
                        <div class="dropdown-option" data-value="A">A</div>
                        <div class="dropdown-option" data-value="B">B</div>
                        <div class="dropdown-option" data-value="C">C</div>
                        <div class="dropdown-option" data-value="D">D</div>
                        <div class="dropdown-option" data-value="E">E</div>
                    </div>
                </div>
            </div>
            ${removeBtn}
        </div>
    `;
    
    // Add custom dropdown functionality
    const dropdown = div.querySelector('.custom-dropdown');
    const selectedText = dropdown.querySelector('.selected-text');
    const options = dropdown.querySelectorAll('.dropdown-option');
    
    options.forEach(option => {
        option.addEventListener('click', () => {
            const value = option.dataset.value;
            selectedText.textContent = value || '-';
            dropdown.className = `custom-dropdown ${value ? `grade-${value.toLowerCase()}` : ''}`;
            handleGradeChange(dropdown.dataset.courseId, value);
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });
    
    // Toggle dropdown
    dropdown.querySelector('.dropdown-selected').addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
    });
    
    return div;
}

function handleGradeChange(courseId, grade) {
    if (!userData.courses[courseId]) {
        userData.courses[courseId] = {};
    }
    
    userData.courses[courseId].grade = grade;
    
    // Update custom dropdown styling
    const dropdown = document.querySelector(`[data-course-id="${courseId}"]`);
    if (dropdown) {
        dropdown.className = `custom-dropdown ${grade ? `grade-${grade.toLowerCase()}` : ''}`;
        const selectedText = dropdown.querySelector('.selected-text');
        if (selectedText) {
            selectedText.textContent = grade || '-';
        }
    }
    
    // Update data science course states if needed
    if (courseId.startsWith('dataScience-opt-')) {
        updateDataScienceCourseStates();
    }
    
    // Update analytics and save
    updateAnalytics();
    saveUserData();
    
    // Update CGPA history
    updateCGPAHistory();
}

// Global function for data science options (deprecated - now handled by course disabling)
window.toggleDataScienceOption = function(option, value) {
    // This function is deprecated - course selection is now handled automatically
    console.log('Data science options are now handled automatically based on course selections');
};

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
                    <span>${elective.code}</span>
                    <span>${elective.credits} credits</span>
                    <span>${elective.category}</span>
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
    
    // Update grade distribution chart with a small delay to ensure DOM is ready
    setTimeout(() => {
        updateGradeDistribution();
    }, 50);
    
    updateSectionCredits();
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
                if (index === 'opt-analytics') {
                    credits = 4;
                } else if (index === 'opt-dl') {
                    credits = 4;
                } else if (index === 'opt-analytics-project') {
                    credits = 2;
                } else if (index === 'opt-dl-project') {
                    credits = 2;
                } else {
                    const course = courseDatabase.diploma.dataScience.courses[parseInt(index)];
                    credits = course ? course.credits : 4;
                }
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
    
    // Update main CGPA
    const cgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '0.00';
    const cgpaElement = document.getElementById('mainCgpa');
    const subtitleElement = document.getElementById('cgpaSubtitle');
    
    if (cgpaElement) cgpaElement.textContent = cgpa;
    if (subtitleElement) subtitleElement.textContent = `${totalCredits} out of 142 credits completed`;
    
    // Update section CGPAs
    const sectionElements = {
        foundationCgpa: sections.foundation,
        programmingCgpa: sections.programming,
        dataScienceCgpa: sections.dataScience,
        degreeCgpa: sections.degree
    };
    
    Object.entries(sectionElements).forEach(([elementId, sectionData]) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = sectionData.credits > 0 ? 
                (sectionData.points / sectionData.credits).toFixed(2) : '0.00';
        }
    });
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
                if (index === 'opt-analytics') {
                    credits = 4;
                } else if (index === 'opt-dl') {
                    credits = 4;
                } else if (index === 'opt-analytics-project') {
                    credits = 2;
                } else if (index === 'opt-dl-project') {
                    credits = 2;
                } else {
                    credits = courseDatabase.diploma.dataScience.courses[parseInt(index)]?.credits || 4;
                }
            } else if (section === 'degreeCore') {
                credits = courseDatabase.degree.core.courses[parseInt(index)]?.credits || 4;
            } else if (section === 'elective') {
                const course = courseDatabase.degree.electives.find(e => e.code === index);
                credits = course ? course.credits : 4;
            }
            
            completedCredits += credits;
        }
    });
    
    const percentage = Math.min(100, Math.round((completedCredits / 142) * 100));
    const progressElement = document.getElementById('progressPercent');
    const progressCircle = document.getElementById('progressCircle');
    
    if (progressElement) progressElement.textContent = `${percentage}%`;
    
    if (progressCircle) {
        const circumference = 2 * Math.PI * 70;
        const offset = circumference - (percentage / 100 * circumference);
        progressCircle.style.strokeDashoffset = offset;
    }
}

function updateGradeDistribution() {
    console.log('Updating grade distribution...');
    
    // Check if Chart.js is available
    if (!ensureChartJS()) {
        console.error('Cannot update grade distribution chart - Chart.js not available');
        return;
    }
    
    const gradeCounts = { S: 0, A: 0, B: 0, C: 0, D: 0, E: 0 };
    
    Object.values(userData.courses).forEach(data => {
        if (data.grade && gradeCounts.hasOwnProperty(data.grade)) {
            gradeCounts[data.grade]++;
        }
    });
    
    console.log('Grade counts:', gradeCounts);
    
    const ctx = document.getElementById('gradeChart');
    if (!ctx) {
        console.error('Grade chart canvas not found');
        return;
    }
    
    const chartCtx = ctx.getContext('2d');
    
    // Clear previous chart
    if (window.gradeChart) {
        window.gradeChart.destroy();
    }
    
    const hasData = Object.values(gradeCounts).some(count => count > 0);
    
    if (hasData) {
        // Use actual color values instead of CSS variables for better compatibility
        const colors = ['#10b981', '#22d3ee', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'];
        
        try {
            window.gradeChart = new Chart(chartCtx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(gradeCounts),
                    datasets: [{
                        data: Object.values(gradeCounts),
                        backgroundColor: colors,
                        borderWidth: 2,
                        borderColor: '#0f172a'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#cbd5e1',
                                padding: 8,
                                font: { size: 10 },
                                usePointStyle: true
                            }
                        }
                    }
                }
            });
            
            console.log('Grade distribution chart created successfully');
        } catch (error) {
            console.error('Error creating grade distribution chart:', error);
        }
    } else {
        // Show placeholder for empty state
        chartCtx.clearRect(0, 0, ctx.width, ctx.height);
        chartCtx.fillStyle = '#94a3b8';
        chartCtx.font = '12px Inter';
        chartCtx.textAlign = 'center';
        chartCtx.fillText('No grades yet', 80, 80);
        console.log('Grade distribution chart shows empty state');
    }
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
                if (index === 'opt-analytics') {
                    credits = 4;
                } else if (index === 'opt-dl') {
                    credits = 4;
                } else if (index === 'opt-analytics-project') {
                    credits = 2;
                } else if (index === 'opt-dl-project') {
                    credits = 2;
                } else {
                    credits = courseDatabase.diploma.dataScience.courses[parseInt(index)]?.credits || 4;
                }
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

function switchSection(section) {
    // Update nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.section === section);
    });
    
    // Hide all sections
    document.querySelectorAll('[id$="Section"]').forEach(content => {
        content.style.display = 'none';
    });
    
    // Show selected section
    const targetSection = document.getElementById(`${section}Section`);
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('fade-in');
    }
    
    // Special handling for different sections
    if (section === 'analytics') {
        // Add a small delay to ensure the section is visible before initializing charts
        setTimeout(() => {
            initializeAnalytics();
        }, 100);
    } else if (section === 'timer') {
        updateTimerDisplay();
        loadTimerHistory();
    }
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        updateCGPATrendChart();
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
    
    // Check if Chart.js is available
    if (!ensureChartJS()) {
        console.error('Cannot update CGPA trend chart - Chart.js not available');
        return;
    }
    
    const ctx = document.getElementById('cgpaTrendChart');
    if (!ctx) {
        console.error('CGPA trend chart canvas not found');
        return;
    }
    
    const chartCtx = ctx.getContext('2d');
    
    // Clear previous chart
    if (window.cgpaTrendChart) {
        window.cgpaTrendChart.destroy();
    }
    
    // Generate trend data from CGPA history
    const trendData = userData.cgpaHistory || [];
    console.log('CGPA trend data:', trendData);
    
    if (trendData.length > 0) {
        // Use actual color values instead of CSS variables for better compatibility
        try {
            window.cgpaTrendChart = new Chart(chartCtx, {
                type: 'line',
                data: {
                    labels: trendData.map((_, index) => `Update ${index + 1}`),
                    datasets: [{
                        label: 'CGPA',
                        data: trendData.map(entry => parseFloat(entry.cgpa)),
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#3b82f6',
                        pointBorderColor: 'white',
                        pointBorderWidth: 2,
                        pointRadius: 5
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
                            min: Math.max(0, Math.min(...trendData.map(e => parseFloat(e.cgpa))) - 1),
                            max: 10,
                            grid: {
                                color: '#475569'
                            },
                            ticks: {
                                color: '#cbd5e1'
                            }
                        },
                        x: {
                            grid: {
                                color: '#475569'
                            },
                            ticks: {
                                color: '#cbd5e1'
                            }
                        }
                    }
                }
            });
            
            console.log('CGPA trend chart created successfully');
        } catch (error) {
            console.error('Error creating CGPA trend chart:', error);
        }
    } else {
        // Show placeholder
        chartCtx.clearRect(0, 0, ctx.width, ctx.height);
        chartCtx.fillStyle = '#94a3b8';
        chartCtx.font = '16px Inter';
        chartCtx.textAlign = 'center';
        chartCtx.fillText('CGPA trend will appear as you add grades', ctx.width / 2, ctx.height / 2);
        console.log('CGPA trend chart shows empty state');
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
                if (index === 'opt-analytics') {
                    credits = 4;
                } else if (index === 'opt-dl') {
                    credits = 4;
                } else if (index === 'opt-analytics-project') {
                    credits = 2;
                } else if (index === 'opt-dl-project') {
                    credits = 2;
                } else {
                    const course = courseDatabase.diploma.dataScience.courses[parseInt(index)];
                    credits = course ? course.credits : 4;
                }
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

window.updateWhatIfCourse = function(id, field, value) {
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

// Timer Functions
function initializeTimer() {
    updateTimerDisplay();
    loadTimerSettings();
}

function populateTimerCourses() {
    const select = document.getElementById('timerCourseSelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select a course...</option>';
    
    // Add foundation courses
    courseDatabase.foundation.courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.code;
        option.textContent = `${course.code} - ${course.name}`;
        select.appendChild(option);
    });
    
    // Add diploma courses
    courseDatabase.diploma.programming.courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.code;
        option.textContent = `${course.code} - ${course.name}`;
        select.appendChild(option);
    });
    
    courseDatabase.diploma.dataScience.courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.code;
        option.textContent = `${course.code} - ${course.name}`;
        select.appendChild(option);
    });
    
    // Add optional data science courses
    const optionalCourses = courseDatabase.diploma.dataScience.optionalCourses;
    [optionalCourses[0].primary, optionalCourses[0].alternative, 
     optionalCourses[1].primary, optionalCourses[1].alternative].forEach(course => {
        const option = document.createElement('option');
        option.value = course.code;
        option.textContent = `${course.code} - ${course.name}`;
        select.appendChild(option);
    });
    
    // Add degree courses
    courseDatabase.degree.core.courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.code;
        option.textContent = `${course.code} - ${course.name}`;
        select.appendChild(option);
    });
    
    // Add selected electives
    userData.electives.forEach(electiveCode => {
        const elective = courseDatabase.degree.electives.find(e => e.code === electiveCode);
        if (elective) {
            const option = document.createElement('option');
            option.value = elective.code;
            option.textContent = `${elective.code} - ${elective.name}`;
            select.appendChild(option);
        }
    });
}

function loadTimerSettings() {
    const studyInput = document.getElementById('studyDuration');
    const breakInput = document.getElementById('breakDuration');
    
    if (studyInput && breakInput) {
        studyInput.value = timerState.studyDuration / 60;
        breakInput.value = timerState.breakDuration / 60;
    }
}

function updateTimerSettings() {
    const studyDuration = parseInt(document.getElementById('studyDuration')?.value || 25) * 60;
    const breakDuration = parseInt(document.getElementById('breakDuration')?.value || 5) * 60;
    
    timerState.studyDuration = studyDuration;
    timerState.breakDuration = breakDuration;
    
    // Reset timer with new duration if not running
    if (!timerState.isRunning) {
        timerState.timeLeft = timerState.isBreak ? breakDuration : studyDuration;
        updateTimerDisplay();
    }
}

function startTimer() {
    if (timerState.isRunning) return;
    
    timerState.isRunning = true;
    timerState.currentCourse = document.getElementById('timerCourseSelect')?.value || '';
    timerState.currentActivity = document.getElementById('timerActivity')?.value || '';
    
    timerState.interval = setInterval(() => {
        timerState.timeLeft--;
        updateTimerDisplay();
        
        if (timerState.timeLeft <= 0) {
            completeTimerSession();
        }
    }, 1000);
    
    updateTimerButtons();
    showToast(`${timerState.isBreak ? 'Break' : 'Study'} session started!`, 'success');
}

function pauseTimer() {
    if (!timerState.isRunning) return;
    
    clearInterval(timerState.interval);
    timerState.isRunning = false;
    updateTimerButtons();
    showToast('Timer paused', 'info');
}

function resetTimer() {
    clearInterval(timerState.interval);
    timerState.isRunning = false;
    timerState.timeLeft = timerState.isBreak ? timerState.breakDuration : timerState.studyDuration;
    updateTimerDisplay();
    updateTimerButtons();
    showToast('Timer reset', 'info');
}

function completeTimerSession() {
    clearInterval(timerState.interval);
    timerState.isRunning = false;
    
    // Save session to history
    const session = {
        type: timerState.isBreak ? 'break' : 'study',
        duration: timerState.isBreak ? timerState.breakDuration : timerState.studyDuration,
        course: timerState.currentCourse,
        activity: timerState.currentActivity,
        completedAt: new Date().toISOString()
    };
    
    timerState.sessions.unshift(session);
    if (timerState.sessions.length > 10) {
        timerState.sessions = timerState.sessions.slice(0, 10);
    }
    
    // Switch between study and break
    timerState.isBreak = !timerState.isBreak;
    timerState.timeLeft = timerState.isBreak ? timerState.breakDuration : timerState.studyDuration;
    
    updateTimerDisplay();
    updateTimerButtons();
    loadTimerHistory();
    
    const sessionType = session.type === 'study' ? 'Study' : 'Break';
    const nextType = timerState.isBreak ? 'break' : 'study';
    showToast(`${sessionType} session completed! Ready for ${nextType}.`, 'success');
    
    // Play notification sound if available
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`${sessionType} session completed!`, {
            body: `Ready for ${nextType} session.`,
            icon: '/icons/icon-192x192.png'
        });
    }
}

function updateTimerDisplay() {
    const display = document.getElementById('timerDisplay');
    const status = document.getElementById('timerStatus');
    
    if (display && status) {
        const minutes = Math.floor(timerState.timeLeft / 60);
        const seconds = timerState.timeLeft % 60;
        display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        status.textContent = timerState.isBreak ? 'Break Time' : 'Study Session';
        display.style.color = timerState.isBreak ? 'var(--accent-success)' : 'var(--accent-primary)';
    }
}

function updateTimerButtons() {
    const startBtn = document.getElementById('startTimer');
    const pauseBtn = document.getElementById('pauseTimer');
    const resetBtn = document.getElementById('resetTimer');
    
    if (startBtn && pauseBtn && resetBtn) {
        startBtn.disabled = timerState.isRunning;
        pauseBtn.disabled = !timerState.isRunning;
        resetBtn.disabled = false;
        
        startBtn.style.opacity = timerState.isRunning ? '0.5' : '1';
        pauseBtn.style.opacity = timerState.isRunning ? '1' : '0.5';
    }
}

function loadTimerHistory() {
    const container = document.getElementById('timerHistoryList');
    if (!container) return;
    
    if (timerState.sessions.length === 0) {
        container.innerHTML = '<div class="text-sm text-secondary">No study sessions yet</div>';
        return;
    }
    
    container.innerHTML = timerState.sessions.map(session => {
        const date = new Date(session.completedAt);
        const duration = Math.floor(session.duration / 60);
        const courseText = session.course ? ` - ${session.course}` : '';
        const activityText = session.activity ? ` (${session.activity})` : '';
        
        return `
            <div style="padding: 0.5rem; background: var(--bg-card); border-radius: 0.375rem; margin-bottom: 0.5rem; font-size: 0.875rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>${session.type === 'study' ? '📚' : '☕'} ${duration} min ${session.type}${courseText}</span>
                    <span class="text-xs text-secondary">${date.toLocaleDateString()}</span>
                </div>
                ${activityText ? `<div class="text-xs text-secondary">${activityText}</div>` : ''}
            </div>
        `;
    }).join('');
}

// Auto-save functionality
function startAutoSave() {
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    
    autoSaveInterval = setInterval(() => {
        if (currentUser) {
            saveUserData();
        }
    }, 30000); // Save every 30 seconds
}

function stopAutoSave() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
        autoSaveInterval = null;
    }
}

async function saveUserData() {
    if (!currentUser) return;
    
    try {
        const token = getStoredToken();
        await fetch(`${API_BASE_URL}/user/data`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userData })
        });
    } catch (error) {
        console.error('Failed to save user data:', error);
    }
}

function logout() {
    stopAutoSave();
    removeStoredToken();
    currentUser = null;
    userData = { 
        courses: {}, 
        electives: [],
        dataScienceOptions: { analytics: true, project: true },
        targetCGPA: null,
        cgpaHistory: []
    };
    whatIfCourses = [];
    
    // Reset timer
    clearInterval(timerState.interval);
    timerState = {
        isRunning: false,
        isBreak: false,
        timeLeft: 25 * 60,
        studyDuration: 25 * 60,
        breakDuration: 5 * 60,
        currentCourse: '',
        currentActivity: '',
        interval: null,
        sessions: []
    };
    
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
    
    // Ctrl/Cmd + 1/2/3 for navigation
    if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '3') {
        e.preventDefault();
        const sections = ['dashboard', 'analytics', 'timer'];
        const sectionIndex = parseInt(e.key) - 1;
        if (sections[sectionIndex]) {
            switchSection(sections[sectionIndex]);
        }
    }
    
    // Space bar for timer control (when in timer section)
    if (e.code === 'Space' && document.getElementById('timerSection').style.display !== 'none') {
        e.preventDefault();
        if (timerState.isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    }
}

// Request notification permission on first load
document.addEventListener('DOMContentLoaded', () => {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
});

// Handle page visibility for auto-pause timer
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden - save data
        if (currentUser) {
            saveUserData();
        }
    } else {
        // Page is visible - could resume timer or refresh data
        if (currentUser) {
            // Optionally refresh data or update UI
            updateTimerDisplay();
        }
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    showToast('Connection restored', 'success');
    if (currentUser) {
        saveUserData(); // Sync any pending changes
    }
});

window.addEventListener('offline', () => {
    showToast('You are offline. Changes will sync when connection is restored.', 'info');
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

// Enhanced error handling for fetch requests
async function fetchWithRetry(url, options = {}, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.ok) {
                return response;
            } else if (response.status === 401) {
                // Token expired, logout user
                logout();
                throw new Error('Authentication failed');
            } else if (i === retries - 1) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            if (i === retries - 1) {
                throw error;
            }
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
        }
    }
}

// Data export functionality (placeholder)
async function exportData(format = 'json') {
    showToast('Export feature coming soon!', 'info');
    
    // This would be implemented when the backend export endpoint is ready
    /*
    try {
        const token = getStoredToken();
        const response = await fetchWithRetry(`${API_BASE_URL}/analytics/export?format=${format}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `studymetrics_${currentUser.username}_${new Date().toISOString().split('T')[0]}.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            showToast(`Data exported as ${format.toUpperCase()}`, 'success');
        }
    } catch (error) {
        showToast('Export failed', 'error');
    }
    */
}

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

// Performance monitoring
const performanceObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
            console.log('Page load time:', entry.loadEventEnd - entry.loadEventStart, 'ms');
        }
    }
});

performanceObserver.observe({ entryTypes: ['navigation'] });

// Memory usage monitoring (for development)
if (performance.memory) {
    setInterval(() => {
        const memory = performance.memory;
        if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
            console.warn('High memory usage detected');
        }
    }, 60000); // Check every minute
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
showElectiveModal = function() {
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
        }
    });
}

// Cleanup on page unload
window.addEventListener('beforeunload', (e) => {
    if (currentUser) {
        // Save any pending data
        navigator.sendBeacon(`${API_BASE_URL}/user/data`, JSON.stringify({
            userData: userData
        }));
    }
    
    // Clear intervals
    stopAutoSave();
    if (timerState.interval) {
        clearInterval(timerState.interval);
    }
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

// Export functions for global access
window.exportData = exportData;
window.calculateTargetCGPA = calculateTargetCGPA;
window.addWhatIfCourse = addWhatIfCourse;
window.removeWhatIfCourse = removeWhatIfCourse;
window.updateWhatIfCourse = updateWhatIfCourse;
window.calculateWhatIf = calculateWhatIf;

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}