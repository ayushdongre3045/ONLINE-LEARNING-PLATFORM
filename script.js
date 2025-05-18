// Mock Data
const courses = [
    {
        id: 1,
        title: 'Introduction to Web Development',
        instructor: 'Sarah Johnson',
        duration: '12 hours',
        level: 'Beginner',
        image: 'https://images.pexels.com/photos/92904/pexels-photo-92904.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        progress: 0,
        lessons: [
            {
                id: 1,
                title: 'HTML Fundamentals',
                duration: '45 minutes',
                videoUrl: 'https://www.youtube.com/embed/qz0aGYrrlhU',
                completed: false
            },
            {
                id: 2,
                title: 'CSS Basics',
                duration: '50 minutes',
                videoUrl: 'https://www.youtube.com/embed/1PnVor36_40',
                completed: false
            }
        ],
        quiz: {
            id: 1,
            title: 'Web Development Basics Quiz',
            questions: [
                {
                    id: 1,
                    question: 'What does HTML stand for?',
                    options: [
                        'Hyper Text Markup Language',
                        'High Tech Modern Language',
                        'Hyper Transfer Markup Language',
                        'Home Tool Markup Language'
                    ],
                    correctAnswer: 0
                },
                {
                    id: 2,
                    question: 'Which CSS property is used to change text color?',
                    options: [
                        'text-color',
                        'font-color',
                        'color',
                        'text-style'
                    ],
                    correctAnswer: 2
                }
            ]
        }
    },
    {
        id: 2,
        title: 'Advanced React Development',
        instructor: 'Michael Chen',
        duration: '15 hours',
        level: 'Advanced',
        image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        progress: 0,
        lessons: [
            {
                id: 3,
                title: 'React Hooks Deep Dive',
                duration: '60 minutes',
                videoUrl: 'https://www.youtube.com/embed/TNhaISOUy6Q',
                completed: false
            }
        ],
        quiz: {
            id: 2,
            title: 'React Advanced Concepts Quiz',
            questions: [
                {
                    id: 3,
                    question: 'What is the purpose of useEffect hook?',
                    options: [
                        'To handle form submissions',
                        'To perform side effects',
                        'To create new components',
                        'To style components'
                    ],
                    correctAnswer: 1
                }
            ]
        }
    }
];

// User state
let currentUser = null;
let currentCourse = null;
let currentLesson = null;

// DOM Elements
const courseGrid = document.getElementById('courseGrid');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

// Initialize the application
function init() {
    renderCourses();
    setupEventListeners();
    checkAuthStatus();
}

// Check authentication status
function checkAuthStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForAuthenticatedUser();
    }
}

// Update UI for authenticated user
function updateUIForAuthenticatedUser() {
    const authButtons = document.querySelector('.auth-buttons');
    if (currentUser) {
        authButtons.innerHTML = `
            <span class="user-name">Welcome, ${currentUser.name}</span>
            <button class="btn btn-login" onclick="handleLogout()">Logout</button>
        `;
    } else {
        authButtons.innerHTML = `
            <button class="btn btn-login" onclick="showLoginModal()">Login</button>
            <button class="btn btn-signup" onclick="showSignupModal()">Sign Up</button>
        `;
    }
}

// Render courses in the grid
function renderCourses() {
    courseGrid.innerHTML = courses.map(course => `
        <div class="course-card" onclick="startCourse(${course.id})">
            <img src="${course.image}" alt="${course.title}" class="course-image">
            <div class="course-content">
                <h3 class="course-title">${course.title}</h3>
                <p class="course-instructor">Instructor: ${course.instructor}</p>
                <div class="course-stats">
                    <span>${course.duration}</span>
                    <span>•</span>
                    <span>${course.level}</span>
                </div>
                ${currentUser ? `
                    <div class="progress-bar">
                        <div class="progress" style="width: ${course.progress}%"></div>
                    </div>
                    <span class="progress-text">${course.progress}% Complete</span>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Start a course
function startCourse(courseId) {
    if (!currentUser) {
        showLoginModal();
        return;
    }

    currentCourse = courses.find(course => course.id === courseId);
    if (currentCourse) {
        renderCourseContent();
    }
}

// Render course content
function renderCourseContent() {
    const mainContent = document.querySelector('main');
    mainContent.innerHTML = `
        <div class="course-dashboard">
            <div class="course-header">
                <h1>${currentCourse.title}</h1>
                <p>Instructor: ${currentCourse.instructor}</p>
            </div>
            
            <div class="course-content-grid">
                <div class="lessons-list">
                    <h2>Lessons</h2>
                    ${currentCourse.lessons.map((lesson, index) => `
                        <div class="lesson-item ${lesson.completed ? 'completed' : ''}" 
                             onclick="startLesson(${lesson.id})">
                            <span class="lesson-number">${index + 1}</span>
                            <div class="lesson-info">
                                <h3>${lesson.title}</h3>
                                <span>${lesson.duration}</span>
                            </div>
                            ${lesson.completed ? '<span class="completed-badge">✓</span>' : ''}
                        </div>
                    `).join('')}
                    
                    <div class="quiz-item" onclick="startQuiz(${currentCourse.quiz.id})">
                        <span class="quiz-icon">📝</span>
                        <div class="quiz-info">
                            <h3>${currentCourse.quiz.title}</h3>
                            <span>${currentCourse.quiz.questions.length} questions</span>
                        </div>
                    </div>
                </div>
                
                <div class="content-viewer" id="contentViewer">
                    <div class="welcome-message">
                        <h2>Welcome to ${currentCourse.title}</h2>
                        <p>Select a lesson to begin learning</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Start a lesson
function startLesson(lessonId) {
    currentLesson = currentCourse.lessons.find(lesson => lesson.id === lessonId);
    if (currentLesson) {
        const contentViewer = document.getElementById('contentViewer');
        contentViewer.innerHTML = `
            <div class="video-container">
                <iframe 
                    src="${currentLesson.videoUrl}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                ></iframe>
            </div>
            <div class="lesson-details">
                <h2>${currentLesson.title}</h2>
                <p>${currentLesson.duration}</p>
                <button class="btn btn-primary" onclick="completeLesson(${lessonId})">
                    Mark as Complete
                </button>
            </div>
        `;
    }
}

// Complete a lesson
function completeLesson(lessonId) {
    const lesson = currentCourse.lessons.find(lesson => lesson.id === lessonId);
    if (lesson) {
        lesson.completed = true;
        updateCourseProgress();
        renderCourseContent();
    }
}

// Start a quiz
function startQuiz(quizId) {
    const quiz = currentCourse.quiz;
    const contentViewer = document.getElementById('contentViewer');
    contentViewer.innerHTML = `
        <div class="quiz-container">
            <h2>${quiz.title}</h2>
            <form id="quizForm" onsubmit="submitQuiz(event)">
                ${quiz.questions.map((question, index) => `
                    <div class="quiz-question">
                        <p class="question-text">${index + 1}. ${question.question}</p>
                        <div class="options">
                            ${question.options.map((option, optIndex) => `
                                <label class="option">
                                    <input type="radio" name="q${question.id}" value="${optIndex}" required>
                                    ${option}
                                </label>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
                <button type="submit" class="btn btn-primary">Submit Quiz</button>
            </form>
        </div>
    `;
}

// Submit quiz
function submitQuiz(event) {
    event.preventDefault();
    const quiz = currentCourse.quiz;
    let score = 0;
    
    quiz.questions.forEach(question => {
        const answer = parseInt(event.target[`q${question.id}`].value);
        if (answer === question.correctAnswer) score++;
    });

    const percentage = (score / quiz.questions.length) * 100;
    const contentViewer = document.getElementById('contentViewer');
    
    contentViewer.innerHTML = `
        <div class="quiz-results">
            <h2>Quiz Results</h2>
            <div class="score-display">
                <div class="score-circle">
                    <span class="score-number">${percentage}%</span>
                </div>
                <p>You got ${score} out of ${quiz.questions.length} questions correct</p>
            </div>
            <button class="btn btn-primary" onclick="renderCourseContent()">
                Return to Course
            </button>
        </div>
    `;

    if (percentage >= 70) {
        currentCourse.progress = 100;
        updateCourseProgress();
    }
}

// Update course progress
function updateCourseProgress() {
    const completedLessons = currentCourse.lessons.filter(lesson => lesson.completed).length;
    const totalLessons = currentCourse.lessons.length;
    currentCourse.progress = Math.round((completedLessons / totalLessons) * 100);
    
    // Save progress to localStorage
    const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
    progress[currentCourse.id] = currentCourse.progress;
    localStorage.setItem('courseProgress', JSON.stringify(progress));
}

// Setup Event Listeners
function setupEventListeners() {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);

    window.addEventListener('click', (e) => {
        if (e.target === loginModal) hideLoginModal();
        if (e.target === signupModal) hideSignupModal();
    });
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    mobileMenuBtn.classList.toggle('active');
}

// Modal Functions
function showLoginModal() {
    loginModal.style.display = 'block';
    signupModal.style.display = 'none';
}

function hideLoginModal() {
    loginModal.style.display = 'none';
}

function showSignupModal() {
    signupModal.style.display = 'block';
    loginModal.style.display = 'none';
}

function hideSignupModal() {
    signupModal.style.display = 'none';
}

// Form Handlers
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        // Mock login
        currentUser = {
            id: 1,
            name: 'John Doe',
            email: email
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        updateUIForAuthenticatedUser();
        hideLoginModal();
        renderCourses();
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        // Mock signup
        currentUser = {
            id: 1,
            name: name,
            email: email
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        updateUIForAuthenticatedUser();
        hideSignupModal();
        renderCourses();
    } catch (error) {
        alert('Signup failed: ' + error.message);
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUIForAuthenticatedUser();
    renderCourses();
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);