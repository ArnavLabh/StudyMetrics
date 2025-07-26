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
            { name: "Business Data Management - Project", code: "BSMS2001P", credits: 2, category: "Management" },
            { name: "Apprenticeship", code: "BSAP3001", credits: "variable", type: "special" },
            { name: "Other", code: "BSOT3001", credits: "variable", type: "special" }
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
        analytics: true,  // true for Business Analytics, false for DL
        project: true     // true for BDM Project, false for DL Project
    }
};
let autoSaveInterval = null;
let isRegistering = false;

// API Configuration
const API_BASE_URL = '/api';

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
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
            
            // Check for updates periodically
            setInterval(() => {
                registration.update();
            }, 60000); // Check every minute
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
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
        // Verify token and load user data
        verifyAndLoadUser(token);
    } else {
        showLoginPage();
    }

    // Setup event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Login/Register Form
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', handleAuth);

    // Toggle between login and register
    document.getElementById('toggleRegister').addEventListener('click', (e) => {
        e.preventDefault();
        isRegistering = !isRegistering;
        updateAuthUI();
    });

    // PIN input auto-focus
    const pinInputs = document.querySelectorAll('.pin-input');
    pinInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value && index < pinInputs.length - 1) {
                pinInputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                pinInputs[index - 1].focus();
            }
        });
    });

    // Navigation tabs
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const section = tab.dataset.section;
            switchSection(section);
        });
    });

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Add elective button
    document.getElementById('addElectiveBtn').addEventListener('click', showElectiveModal);

    // Modal controls
    document.getElementById('modalClose').addEventListener('click', hideElectiveModal);
    document.getElementById('electiveModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) hideElectiveModal();
    });

    // Elective search
    document.getElementById('electiveSearch').addEventListener('input', filterElectives);
}

function updateAuthUI() {
    const button = document.querySelector('.form-button span');
    const toggleLink = document.getElementById('toggleRegister');
    const subtitle = document.querySelector('.login-subtitle');
    
    if (isRegistering) {
        button.textContent = 'Create Account';
        toggleLink.textContent = 'Login instead';
        subtitle.textContent = 'Create your account to get started';
    } else {
        button.textContent = 'Login';
        toggleLink.textContent = 'Create one';
        subtitle.textContent = 'Track your IITMBS academic progress';
    }
}

async function handleAuth(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const pinInputs = document.querySelectorAll('.pin-input');
    const pin = Array.from(pinInputs).map(input => input.value).join('');
    
    if (pin.length !== 4) {
        showToast('Please enter a 4-digit PIN', 'error');
        return;
    }

    showLoader('loginBtnText', 'loginLoader');

    try {
        const endpoint = isRegistering ? '/auth/register' : '/auth/login';
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, pin })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            currentUser = data.user;
            showMainApp();
            loadUserData();
            showToast(isRegistering ? 'Account created successfully!' : 'Welcome back!', 'success');
        } else {
            showToast(data.message || 'Authentication failed', 'error');
        }
    } catch (error) {
        showToast('Network error. Please try again.', 'error');
    } finally {
        hideLoader('loginBtnText', 'loginLoader');
    }
}

async function verifyAndLoadUser(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            showMainApp();
            loadUserData();
        } else {
            localStorage.removeItem('authToken');
            showLoginPage();
        }
    } catch (error) {
        localStorage.removeItem('authToken');
        showLoginPage();
    }
}

function showLoginPage() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
}

function showMainApp() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    
    // Update user info
    document.getElementById('userAvatar').textContent = currentUser.username[0].toUpperCase();
    document.getElementById('welcomeMessage').textContent = `Welcome back, ${currentUser.username}`;
    
    // Start auto-save
    startAutoSave();
}

async function loadUserData() {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/user/data`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            userData = data.userData || { 
                courses: {}, 
                electives: [],
                dataScienceOptions: {
                    analytics: true,
                    project: true
                }
            };
            renderAllCourses();
            updateAnalytics();
        }
    } catch (error) {
        console.error('Failed to load user data:', error);
    }
}

function renderAllCourses() {
    // Render Foundation courses
    renderCourseList('foundationCourses', courseDatabase.foundation.courses, 'foundation');
    
    // Render Diploma courses
    renderCourseList('programmingCourses', courseDatabase.diploma.programming.courses, 'programming');
    renderDataScienceCourses();
    
    // Render Degree core courses
    renderCourseList('degreeCourses', courseDatabase.degree.core.courses, 'degreeCore');
    
    // Render selected electives
    renderElectives();
}

function renderDataScienceCourses() {
    const container = document.getElementById('dataScienceCourses');
    container.innerHTML = '';
    
    // Add option selector for Business Analytics vs Deep Learning
    const optionDiv = document.createElement('div');
    optionDiv.className = 'option-selector';
    optionDiv.innerHTML = `
        <div class="option-label">Choose your track:</div>
        <div class="option-buttons">
            <button class="option-btn ${userData.dataScienceOptions.analytics ? 'active' : ''}" 
                    onclick="toggleDataScienceOption('analytics', true)">Business Analytics Track</button>
            <button class="option-btn ${!userData.dataScienceOptions.analytics ? 'active' : ''}" 
                    onclick="toggleDataScienceOption('analytics', false)">Deep Learning Track</button>
        </div>
    `;
    container.appendChild(optionDiv);
    
    // Render fixed courses
    courseDatabase.diploma.dataScience.courses.forEach((course, index) => {
        const courseCard = createCourseCard(course, 'dataScience', index);
        container.appendChild(courseCard);
    });
    
    // Render optional courses based on selection
    const optionalCourses = courseDatabase.diploma.dataScience.optionalCourses;
    
    // Analytics/DL course
    const analyticsCourse = userData.dataScienceOptions.analytics ? 
        optionalCourses[0].primary : optionalCourses[0].alternative;
    const analyticsCard = createCourseCard(analyticsCourse, 'dataScience', 'opt-analytics');
    container.appendChild(analyticsCard);
    
    // Project course
    const projectCourse = userData.dataScienceOptions.project ? 
        optionalCourses[1].primary : optionalCourses[1].alternative;
    const projectCard = createCourseCard(projectCourse, 'dataScience', 'opt-project');
    container.appendChild(projectCard);
    
    enableDragAndDrop(container);
}

// Global function to toggle data science options
window.toggleDataScienceOption = function(option, value) {
    if (option === 'analytics') {
        userData.dataScienceOptions.analytics = value;
        userData.dataScienceOptions.project = value; // Keep them synced
    }
    renderDataScienceCourses();
    updateAnalytics();
    saveUserData();
};

function renderCourseList(containerId, courses, section) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    courses.forEach((course, index) => {
        const courseCard = createCourseCard(course, section, index);
        container.appendChild(courseCard);
    });
    
    // Enable drag and drop
    enableDragAndDrop(container);
}

function createCourseCard(course, section, index) {
    const div = document.createElement('div');
    div.className = 'course-card';
    div.draggable = true;
    div.dataset.courseId = `${section}-${index}`;
    
    const savedData = userData.courses[`${section}-${index}`] || {};
    const grade = savedData.grade || '';
    
    div.innerHTML = `
        <div class="course-info">
            <div class="course-code">${course.code}</div>
            <div class="course-name">${course.name}</div>
        </div>
        <div class="course-controls">
            <div class="credits-input">${course.credits} credits</div>
            <select class="grade-select ${grade ? `grade-${grade.toLowerCase()}` : ''}" 
                    data-course-id="${section}-${index}">
                <option value="">-</option>
                <option value="S" ${grade === 'S' ? 'selected' : ''}>S (10)</option>
                <option value="A" ${grade === 'A' ? 'selected' : ''}>A (9)</option>
                <option value="B" ${grade === 'B' ? 'selected' : ''}>B (8)</option>
                <option value="C" ${grade === 'C' ? 'selected' : ''}>C (7)</option>
                <option value="D" ${grade === 'D' ? 'selected' : ''}>D (6)</option>
                <option value="E" ${grade === 'E' ? 'selected' : ''}>E (4)</option>
            </select>
        </div>
    `;
    
    // Add grade change listener
    const gradeSelect = div.querySelector('.grade-select');
    gradeSelect.addEventListener('change', (e) => {
        handleGradeChange(e.target.dataset.courseId, e.target.value);
    });
    
    return div;
}

function handleGradeChange(courseId, grade) {
    if (!userData.courses[courseId]) {
        userData.courses[courseId] = {};
    }
    
    userData.courses[courseId].grade = grade;
    
    // Update select styling
    const select = document.querySelector(`[data-course-id="${courseId}"]`);
    select.className = `grade-select ${grade ? `grade-${grade.toLowerCase()}` : ''}`;
    
    // Update analytics
    updateAnalytics();
    
    // Save data
    saveUserData();
}

function renderElectives() {
    const container = document.getElementById('electiveCourses');
    container.innerHTML = '';
    
    userData.electives.forEach(electiveCode => {
        const elective = courseDatabase.degree.electives.find(e => e.code === electiveCode);
        if (elective) {
            const courseCard = createCourseCard(elective, 'elective', electiveCode);
            
            // Add remove button for electives
            const removeBtn = document.createElement('button');
            removeBtn.textContent = '×';
            removeBtn.style.cssText = 'background: var(--accent-red); color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin-left: 0.5rem; cursor: pointer;';
            removeBtn.onclick = () => removeElective(electiveCode);
            
            courseCard.querySelector('.course-controls').appendChild(removeBtn);
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
    
    availableElectives.forEach(elective => {
        const div = document.createElement('div');
        div.className = 'elective-item';
        div.innerHTML = `
            <div class="elective-item-name">${elective.name}</div>
            <div class="elective-item-meta">
                <span>${elective.code}</span>
                <span>${elective.credits === 'variable' ? 'Variable' : elective.credits} credits</span>
                ${elective.category ? `<span>${elective.category}</span>` : ''}
            </div>
        `;
        
        div.onclick = () => addElective(elective.code);
        container.appendChild(div);
    });
}

function filterElectives(e) {
    renderElectiveList(e.target.value);
}

function addElective(code) {
    userData.electives.push(code);
    renderElectives();
    updateAnalytics();
    saveUserData();
    hideElectiveModal();
    showToast('Elective added successfully!', 'success');
}

function removeElective(code) {
    userData.electives = userData.electives.filter(e => e !== code);
    delete userData.courses[`elective-${code}`];
    renderElectives();
    updateAnalytics();
    saveUserData();
    showToast('Elective removed', 'success');
}

function enableDragAndDrop(container) {
    let draggedElement = null;
    
    container.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('course-card')) {
            draggedElement = e.target;
            e.target.classList.add('dragging');
        }
    });
    
    container.addEventListener('dragend', (e) => {
        if (e.target.classList.contains('course-card')) {
            e.target.classList.remove('dragging');
        }
    });
    
    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        if (afterElement == null) {
            container.appendChild(draggedElement);
        } else {
            container.insertBefore(draggedElement, afterElement);
        }
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.course-card:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateAnalytics() {
    calculateCGPA();
    updateProgress();
    updateGradeDistribution();
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
    
    // Process all courses
    Object.entries(userData.courses).forEach(([courseId, data]) => {
        if (data.grade && gradeScale[data.grade]) {
            const [section, index] = courseId.split('-');
            let credits = 0;
            let course = null;
            
            // Find course and credits
            if (section === 'foundation') {
                course = courseDatabase.foundation.courses[parseInt(index)];
                credits = course ? course.credits : 4;
                sections.foundation.points += gradeScale[data.grade] * credits;
                sections.foundation.credits += credits;
            } else if (section === 'programming') {
                course = courseDatabase.diploma.programming.courses[parseInt(index)];
                credits = course ? course.credits : 4;
                sections.programming.points += gradeScale[data.grade] * credits;
                sections.programming.credits += credits;
            } else if (section === 'dataScience') {
                // Handle both fixed and optional courses
                if (index === 'opt-analytics') {
                    credits = 4;
                } else if (index === 'opt-project') {
                    credits = 2;
                } else {
                    course = courseDatabase.diploma.dataScience.courses[parseInt(index)];
                    credits = course ? course.credits : 4;
                }
                sections.dataScience.points += gradeScale[data.grade] * credits;
                sections.dataScience.credits += credits;
            } else if (section === 'degreeCore') {
                course = courseDatabase.degree.core.courses[parseInt(index)];
                credits = course ? course.credits : 4;
                sections.degree.points += gradeScale[data.grade] * credits;
                sections.degree.credits += credits;
            } else if (section === 'elective') {
                const electiveCode = index;
                course = courseDatabase.degree.electives.find(e => e.code === electiveCode);
                credits = course && course.credits !== 'variable' ? course.credits : (data.credits || 4);
                sections.degree.points += gradeScale[data.grade] * credits;
                sections.degree.credits += credits;
            }
            
            totalGradePoints += gradeScale[data.grade] * credits;
            totalCredits += credits;
        }
    });
    
    // Update main CGPA
    const cgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '0.00';
    document.getElementById('mainCgpa').textContent = cgpa;
    document.getElementById('cgpaSubtitle').textContent = `${totalCredits} out of 142 credits completed`;
    
    // Update section CGPAs
    document.getElementById('foundationCgpa').textContent = 
        sections.foundation.credits > 0 ? (sections.foundation.points / sections.foundation.credits).toFixed(2) : '0.00';
    document.getElementById('programmingCgpa').textContent = 
        sections.programming.credits > 0 ? (sections.programming.points / sections.programming.credits).toFixed(2) : '0.00';
    document.getElementById('dataScienceCgpa').textContent = 
        sections.dataScience.credits > 0 ? (sections.dataScience.points / sections.dataScience.credits).toFixed(2) : '0.00';
    document.getElementById('degreeCgpa').textContent = 
        sections.degree.credits > 0 ? (sections.degree.points / sections.degree.credits).toFixed(2) : '0.00';
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
                } else if (index === 'opt-project') {
                    credits = 2;
                } else {
                    credits = courseDatabase.diploma.dataScience.courses[parseInt(index)]?.credits || 4;
                }
            } else if (section === 'degreeCore') {
                credits = courseDatabase.degree.core.courses[parseInt(index)]?.credits || 4;
            } else if (section === 'elective') {
                const course = courseDatabase.degree.electives.find(e => e.code === index);
                credits = course && course.credits !== 'variable' ? course.credits : (data.credits || 4);
            }
            
            completedCredits += credits;
        }
    });
    
    const percentage = Math.round((completedCredits / 142) * 100);
    document.getElementById('progressPercent').textContent = `${percentage}%`;
    
    // Update progress circle
    const progressCircle = document.getElementById('progressCircle');
    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (percentage / 100 * circumference);
    progressCircle.style.strokeDashoffset = offset;
}

function updateGradeDistribution() {
    const gradeCounts = { S: 0, A: 0, B: 0, C: 0, D: 0, E: 0 };
    
    Object.values(userData.courses).forEach(data => {
        if (data.grade && gradeCounts.hasOwnProperty(data.grade)) {
            gradeCounts[data.grade]++;
        }
    });
    
    // Update grade chart
    const ctx = document.getElementById('gradeChart');
    if (ctx) {
        const chartCtx = ctx.getContext('2d');
        
        if (window.gradeChart) {
            window.gradeChart.destroy();
        }
        
        window.gradeChart = new Chart(chartCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(gradeCounts),
                datasets: [{
                    data: Object.values(gradeCounts),
                    backgroundColor: [
                        '#10b981', // S - green
                        '#34d399', // A - light green
                        '#fbbf24', // B - yellow
                        '#fb923c', // C - orange
                        '#f87171', // D - light red
                        '#ef4444'  // E - red
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#9ca3af',
                            padding: 10,
                            font: { size: 12 }
                        }
                    }
                }
            }
        });
    }
}

function updateSectionCredits() {
    // Calculate completed credits for each section
    const sectionCredits = {
        foundation: { completed: 0, total: 32 },
        programming: { completed: 0, total: 27 },
        dataScience: { completed: 0, total: 27 },
        degree: { completed: 0, total: 56 },
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
                } else if (index === 'opt-project') {
                    credits = 2;
                } else {
                    credits = courseDatabase.diploma.dataScience.courses[parseInt(index)]?.credits || 4;
                }
                sectionCredits.dataScience.completed += credits;
            } else if (section === 'degreeCore') {
                credits = courseDatabase.degree.core.courses[parseInt(index)]?.credits || 4;
                sectionCredits.degreeCore.completed += credits;
                sectionCredits.degree.completed += credits;
            } else if (section === 'elective') {
                const course = courseDatabase.degree.electives.find(e => e.code === index);
                credits = course && course.credits !== 'variable' ? course.credits : (data.credits || 4);
                sectionCredits.electives.completed += credits;
                sectionCredits.degree.completed += credits;
            }
        }
    });
    
    // Update credit badges
    document.getElementById('foundationCredits').textContent = 
        `${sectionCredits.foundation.completed}/${sectionCredits.foundation.total} credits`;
    document.getElementById('programmingCredits').textContent = 
        `${sectionCredits.programming.completed}/${sectionCredits.programming.total} credits`;
    document.getElementById('dataScienceCredits').textContent = 
        `${sectionCredits.dataScience.completed}/${sectionCredits.dataScience.total} credits`;
    document.getElementById('degreeCredits').textContent = 
        `${sectionCredits.degreeCore.completed}/${sectionCredits.degreeCore.total} credits`;
    document.getElementById('electiveCredits').textContent = 
        `${sectionCredits.electives.completed}/${sectionCredits.electives.total}+ credits`;
}

function switchSection(section) {
    // Update nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.section === section);
    });
    
    // Update sections
    document.querySelectorAll('.section-content').forEach(content => {
        content.classList.toggle('active', content.id === `${section}Section`);
    });
    
    // Special handling for analytics section
    if (section === 'analytics') {
        initializeWhatIfAnalysis();
        addExportButtons();
        
        // Add event listener for target CGPA calculation
        const targetInput = document.getElementById('targetCgpa');
        if (targetInput && !targetInput.hasListener) {
            targetInput.addEventListener('change', calculateTargetCGPA);
            targetInput.hasListener = true;
        }
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Auto-save functionality
function startAutoSave() {
    autoSaveInterval = setInterval(() => {
        saveUserData();
    }, 30000); // Save every 30 seconds
}

function stopAutoSave() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
        autoSaveInterval = null;
    }
}

async function saveUserData() {
    try {
        const token = localStorage.getItem('authToken');
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
    localStorage.removeItem('authToken');
    currentUser = null;
    userData = { 
        courses: {}, 
        electives: [],
        dataScienceOptions: {
            analytics: true,
            project: true
        }
    };
    showLoginPage();
    showToast('Logged out successfully', 'success');
}

// Utility functions
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showLoader(textId, loaderId) {
    document.getElementById(textId).style.display = 'none';
    document.getElementById(loaderId).style.display = 'inline-block';
}

function hideLoader(textId, loaderId) {
    document.getElementById(textId).style.display = 'inline';
    document.getElementById(loaderId).style.display = 'none';
}

function calculateCurrentStats(courseData) {
    const gradePoints = { S: 10, A: 9, B: 8, C: 7, D: 6, E: 4 };
    let totalPoints = 0;
    let completedCredits = 0;

    Object.entries(courseData.courses).forEach(([courseId, data]) => {
        if (data.grade && gradePoints[data.grade]) {
            const [section, index] = courseId.split('-');
            let credits = 4; // Default credits
            
            // Get actual credits based on course
            if (section === 'foundation') {
                const course = courseDatabase.foundation.courses[parseInt(index)];
                credits = course ? course.credits : 4;
            } else if (section === 'programming') {
                const course = courseDatabase.diploma.programming.courses[parseInt(index)];
                credits = course ? course.credits : 4;
            } else if (section === 'dataScience') {
                if (index === 'opt-analytics') {
                    credits = 4;
                } else if (index === 'opt-project') {
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
                credits = course && course.credits !== 'variable' ? course.credits : (data.credits || 4);
            }
            
            totalPoints += gradePoints[data.grade] * credits;
            completedCredits += credits;
        }
    });

    return {
        totalPoints,
        completedCredits,
        cgpa: completedCredits > 0 ? (totalPoints / completedCredits).toFixed(2) : '0.00'
    };
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateCGPA,
        gradeScale,
        courseDatabase
    };
}

// Additional Features

// Export data functionality
async function exportData(format = 'json') {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/analytics/export?format=${format}`, {
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
        } else {
            showToast('Export failed', 'error');
        }
    } catch (error) {
        showToast('Export failed', 'error');
    }
}

// Target CGPA Calculator
async function calculateTargetCGPA() {
    const targetCgpaInput = document.getElementById('targetCgpa');
    const targetCGPA = parseFloat(targetCgpaInput.value);
    
    if (!targetCGPA || targetCGPA < 0 || targetCGPA > 10) {
        showToast('Please enter a valid target CGPA (0-10)', 'error');
        return;
    }

    // Calculate remaining credits
    const completedCredits = calculateCompletedCredits();
    const remainingCredits = 142 - completedCredits;

    try {
        const token = localStorage.getItem('authToken');
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
        }
    } catch (error) {
        console.error('Target CGPA calculation failed:', error);
    }
}

function calculateCompletedCredits() {
    let credits = 0;
    Object.entries(userData.courses).forEach(([courseId, data]) => {
        if (data.grade) {
            const [section, index] = courseId.split('-');
            
            if (section === 'foundation') {
                credits += courseDatabase.foundation.courses[parseInt(index)]?.credits || 4;
            } else if (section === 'programming') {
                credits += courseDatabase.diploma.programming.courses[parseInt(index)]?.credits || 4;
            } else if (section === 'dataScience') {
                if (index === 'opt-analytics') {
                    credits += 4;
                } else if (index === 'opt-project') {
                    credits += 2;
                } else {
                    credits += courseDatabase.diploma.dataScience.courses[parseInt(index)]?.credits || 4;
                }
            } else if (section === 'degreeCore') {
                credits += courseDatabase.degree.core.courses[parseInt(index)]?.credits || 4;
            } else if (section === 'elective') {
                const course = courseDatabase.degree.electives.find(e => e.code === index);
                credits += course && course.credits !== 'variable' ? course.credits : 4;
            }
        }
    });
    return credits;
}

function displayTargetAnalysis(data) {
    const container = document.getElementById('targetAnalysis');
    
    if (!data.feasible) {
        container.innerHTML = `
            <div style="color: var(--accent-red); padding: 1rem; background: rgba(239, 68, 68, 0.1); border-radius: 0.5rem;">
                <strong>Not Feasible!</strong><br>
                The target CGPA cannot be achieved with the remaining credits.
            </div>
        `;
        return;
    }

    let html = `
        <div style="padding: 1rem; background: var(--bg-card); border-radius: 0.5rem;">
            <p><strong>Current CGPA:</strong> ${data.currentCGPA}</p>
            <p><strong>Required Average Grade:</strong> ${data.requiredAverageGrade}</p>
            <p style="margin-top: 1rem;"><strong>Recommended Grade Combinations:</strong></p>
    `;

    data.recommendations.forEach((rec, index) => {
        html += `
            <div style="padding: 0.5rem; background: var(--bg-hover); border-radius: 0.25rem; margin-top: 0.5rem;">
                Option ${index + 1}: 
                ${rec.S} S grades, ${rec.A} A grades, ${rec.B} B grades, ${rec.C} C grades
                (Avg: ${rec.averageGrade})
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

// What-if Analysis
function initializeWhatIfAnalysis() {
    const container = document.getElementById('whatIfScenarios');
    if (!container) return;

    container.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">
                Add grades for remaining courses:
            </label>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <select id="whatIfGrade" class="grade-select" style="flex: 1; min-width: 100px;">
                    <option value="S">S (10)</option>
                    <option value="A">A (9)</option>
                    <option value="B">B (8)</option>
                    <option value="C">C (7)</option>
                    <option value="D">D (6)</option>
                    <option value="E">E (4)</option>
                </select>
                <input type="number" id="whatIfCredits" placeholder="Credits" min="1" max="50" 
                       style="width: 100px;" class="form-input">
                <button onclick="addWhatIfScenario()" class="form-button" 
                        style="padding: 0.5rem 1rem;">Add</button>
            </div>
        </div>
        <div id="whatIfResults"></div>
    `;
}

window.addWhatIfScenario = function() {
    const grade = document.getElementById('whatIfGrade').value;
    const credits = parseInt(document.getElementById('whatIfCredits').value);
    
    if (!credits || credits < 1) {
        showToast('Please enter valid credits', 'error');
        return;
    }

    // Calculate new CGPA with what-if scenario
    const currentStats = calculateCurrentStats(userData);
    const newPoints = currentStats.totalPoints + (gradeScale[grade] * credits);
    const newCredits = currentStats.completedCredits + credits;
    const newCGPA = (newPoints / newCredits).toFixed(2);
    
    const resultsDiv = document.getElementById('whatIfResults');
    resultsDiv.innerHTML = `
        <div style="padding: 1rem; background: var(--bg-card); border-radius: 0.5rem; margin-top: 1rem;">
            <p><strong>What-if Scenario:</strong></p>
            <p>Adding ${credits} credits with grade ${grade}</p>
            <p><strong>Current CGPA:</strong> ${currentStats.cgpa}</p>
            <p><strong>New CGPA:</strong> <span style="color: var(--accent-green); font-size: 1.25rem;">
                ${newCGPA}</span></p>
            <p><strong>CGPA Change:</strong> ${newCGPA > currentStats.cgpa ? '+' : ''}${(newCGPA - currentStats.cgpa).toFixed(2)}</p>
        </div>
    `;
};

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveUserData();
        showToast('Data saved', 'success');
    }
    
    // Ctrl/Cmd + E to export
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        exportData('json');
    }
});

// Add export buttons to Analytics section
function addExportButtons() {
    const analyticsSection = document.getElementById('analyticsSection');
    if (analyticsSection && !document.getElementById('exportSection')) {
        const exportDiv = document.createElement('div');
        exportDiv.id = 'exportSection';
        exportDiv.style.cssText = 'margin-top: 2rem; text-align: center;';
        exportDiv.innerHTML = `
            <h3 style="margin-bottom: 1rem;">Export Your Data</h3>
            <button onclick="exportData('json')" class="form-button" style="margin: 0 0.5rem; display: inline-block; width: auto; padding: 0.75rem 2rem;">
                Export as JSON
            </button>
            <button onclick="exportData('csv')" class="form-button" style="margin: 0 0.5rem; display: inline-block; width: auto; padding: 0.75rem 2rem;">
                Export as CSV
            </button>
        `;
        analyticsSection.appendChild(exportDiv);
    }
}

// Make export function global
window.exportData = exportData;