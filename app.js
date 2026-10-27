document.addEventListener('DOMContentLoaded', function() {

    // Sample Data for Languages and Categories
    const courseData = {
        spanish: {
            vocabulary: [
                { word: "Hola", meaning: "Hello", translation: "Pronounced: OH-lah" },
                { word: "Gracias", meaning: "Thank you", translation: "Pronounced: GRAH-syas" },
                { word: "Amigo", meaning: "Friend", translation: "Pronounced: ah-MEE-goh" }
            ],
            phrases: [
                { word: "¿Cómo estás?", meaning: "How are you?", translation: "Formal/Informal check" },
                { word: "Buenos días", meaning: "Good morning", translation: "Used until noon" }
            ],
            grammar: [
                { word: "Ser vs Estar", meaning: "To be (Permanent vs Temporary)", translation: "Core verb rule" }
            ]
        },
        french: {
            vocabulary: [
                { word: "Bonjour", meaning: "Hello", translation: "Pronounced: bohn-ZHOOR" },
                { word: "Merci", meaning: "Thank you", translation: "Pronounced: mair-SEE" },
                { word: "Ami", meaning: "Friend", translation: "Pronounced: ah-MEE" }
            ],
            phrases: [
                { word: "Comment ça va?", meaning: "How are you?", translation: "Common greeting" }
            ],
            grammar: [
                { word: "Le / La / Les", meaning: "Definite Articles (The)", translation: "Gender-based nouns" }
            ]
        }
    };

    // Quiz Questions Data
    const quizData = [
        {
            question: "What does 'Hola' mean in Spanish?",
            options: ["Goodbye", "Hello", "Please", "Thank you"],
            correct: 1
        },
        {
            question: "What does 'Merci' mean in French?",
            options: ["Thank you", "Yes", "No", "Friend"],
            correct: 0
        },
        {
            question: "What does 'Amigo' mean?",
            options: ["Enemy", "Family", "Friend", "Stranger"],
            correct: 2
        }
    ];

    let currentLanguage = 'spanish';
    let currentCategory = 'vocabulary';
    let currentIndex = 0;
    let isFlipped = false;

    // DOM Elements
    const targetLanguageSelect = document.getElementById('targetLanguage');
    const categoriesSection = document.querySelector('.categories-section');
    const lessonSection = document.getElementById('lessonSection');
    const backToDashboardBtn = document.getElementById('backToDashboard');
    const lessonTitle = document.getElementById('lessonTitle');
    
    const flashcard = document.getElementById('flashcard');
    const cardWord = document.getElementById('cardWord');
    const cardMeaning = document.getElementById('cardMeaning');
    const cardTranslation = document.getElementById('cardTranslation');
    const cardCounter = document.getElementById('cardCounter');
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Quiz Elements
    const startQuizBtn = document.getElementById('startQuizBtn');
    const quizBox = document.getElementById('quizBox');
    const quizQuestion = document.getElementById('quizQuestion');
    const quizOptions = document.getElementById('quizOptions');
    const nextQuizBtn = document.getElementById('nextQuizBtn');
    const quizScoreBox = document.getElementById('quizScoreBox');
    const finalScore = document.getElementById('finalScore');
    const totalQuestions = document.getElementById('totalQuestions');
    const restartQuizBtn = document.getElementById('restartQuizBtn');

    let currentQuizIndex = 0;
    let score = 0;

    // 1. Language Selection Change
    targetLanguageSelect.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        localStorage.setItem('selectedLanguage', currentLanguage);
    });

    // Load saved language from LocalStorage if available
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang && courseData[savedLang]) {
        currentLanguage = savedLang;
        targetLanguageSelect.value = savedLang;
    }

    // 2. Click on Categories to Open Lessons
    document.querySelectorAll('.cat-card').forEach(card => {
        card.addEventListener('click', function() {
            currentCategory = this.getAttribute('data-category');
            currentIndex = 0;
            isFlipped = false;
            
            categoriesSection.style.display = 'none';
            lessonSection.style.display = 'block';
            lessonTitle.textContent = currentCategory.toUpperCase();
            
            loadFlashcard();
        });
    });

    // Back to Dashboard
    backToDashboardBtn.addEventListener('click', () => {
        lessonSection.style.display = 'none';
        categoriesSection.style.display = 'block';
    });

    // 3. Flashcard Flip Effect
    flashcard.addEventListener('click', () => {
        isFlipped = !isFlipped;
        const currentData = courseData[currentLanguage][currentCategory][currentIndex];
        
        if (isFlipped) {
            cardWord.style.display = 'none';
            cardMeaning.style.display = 'block';
            cardTranslation.style.display = 'block';
            cardMeaning.textContent = currentData.meaning;
            cardTranslation.textContent = currentData.translation;
        } else {
            cardMeaning.style.display = 'none';
            cardTranslation.style.display = 'none';
            cardWord.style.display = 'block';
            cardWord.textContent = currentData.word;
        }
    });

    // Load Flashcard Data
    function loadFlashcard() {
        const items = courseData[currentLanguage][currentCategory];
        if (!items || items.length === 0) return;
        
        const currentData = items[currentIndex];
        isFlipped = false;
        cardWord.style.display = 'block';
        cardMeaning.style.display = 'none';
        cardTranslation.style.display = 'none';
        
        cardWord.textContent = currentData.word;
        cardCounter.textContent = `${currentIndex + 1} / ${items.length}`;
    }

    // Next & Previous Buttons
    nextBtn.addEventListener('click', () => {
        const items = courseData[currentLanguage][currentCategory];
        if (currentIndex < items.length - 1) {
            currentIndex++;
            loadFlashcard();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            loadFlashcard();
        }
    });

    // 4. Interactive Quiz Logic
    startQuizBtn.addEventListener('click', () => {
        startQuizBtn.style.display = 'none';
        quizBox.style.display = 'block';
        currentQuizIndex = 0;
        score = 0;
        loadQuizQuestion();
    });

    function loadQuizQuestion() {
        nextQuizBtn.style.display = 'none';
        const q = quizData[currentQuizIndex];
        quizQuestion.textContent = q.question;
        quizOptions.innerHTML = '';

        q.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.classList.add('option-btn');
            btn.textContent = option;
            btn.addEventListener('click', () => selectOption(index, q.correct));
            quizOptions.appendChild(btn);
        });
    }

    function selectOption(selected, correct) {
        const buttons = quizOptions.querySelectorAll('.option-btn');
        buttons.forEach((btn, idx) => {
            btn.disabled = true;
            if (idx === correct) {
                btn.style.background = '#10B981'; // Green for correct
                btn.style.color = 'white';
            } else if (idx === selected) {
                btn.style.background = '#EF4444'; // Red for wrong
                btn.style.color = 'white';
            }
        });

        if (selected === correct) {
            score++;
        }

        nextQuizBtn.style.display = 'block';
    }

    nextQuizBtn.addEventListener('click', () => {
        currentQuizIndex++;
        if (currentQuizIndex < quizData.length) {
            loadQuizQuestion();
        } else {
            showQuizScore();
        }
    });

    function showQuizScore() {
        quizBox.style.display = 'none';
        quizScoreBox.style.display = 'block';
        finalScore.textContent = score;
        totalQuestions.textContent = quizData.length;

        // Save high score to LocalStorage
        localStorage.setItem('latestQuizScore', score);
    }

    restartQuizBtn.addEventListener('click', () => {
        quizScoreBox.style.display = 'none';
        startQuizBtn.style.display = 'block';
    });

});

