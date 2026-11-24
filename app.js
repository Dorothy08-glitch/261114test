// 1. 단어 데이터베이스 (인도네시아어 기초 단어 15개)
const wordList = [
  {
    category: "greeting",
    indo: "Halo",
    pronounce: "[할로]",
    meaning: "안녕하세요 / 안녕",
    example: "Halo, nama saya Minwoo.",
    exampleKo: "안녕하세요, 제 이름은 민우입니다."
  },
  {
    category: "greeting",
    indo: "Terima kasih",
    pronounce: "[뜨리마 까시]",
    meaning: "감사합니다",
    example: "Terima kasih banyak!",
    exampleKo: "정말 대단히 감사합니다!"
  },
  {
    category: "greeting",
    indo: "Sama-sama",
    pronounce: "[사마 사마]",
    meaning: "천만에요 / 별말씀을요",
    example: "Sama-sama, tidak apa-apa.",
    exampleKo: "천만에요, 괜찮습니다."
  },
  {
    category: "greeting",
    indo: "Selamat pagi",
    pronounce: "[슬라맛 빠기]",
    meaning: "좋은 아침입니다 (아침 인사)",
    example: "Selamat pagi, apa kabar?",
    exampleKo: "좋은 아침입니다, 잘 지내세요?"
  },
  {
    category: "greeting",
    indo: "Apa kabar?",
    pronounce: "[아빠 까바르]",
    meaning: "어떻게 지내세요? (안부)",
    example: "Kabar baik, terima kasih.",
    exampleKo: "잘 지내요, 감사합니다."
  },
  {
    category: "daily",
    indo: "Ya / Tidak",
    pronounce: "[야 / 띠닥]",
    meaning: "네 / 아니요",
    example: "Ya, saya mau ini.",
    exampleKo: "네, 저는 이것을 원해요."
  },
  {
    category: "daily",
    indo: "Tolong",
    pronounce: "[똘롱]",
    meaning: "부탁합니다 / 도와주세요",
    example: "Tolong bantu saya.",
    exampleKo: "저를 좀 도와주세요."
  },
  {
    category: "daily",
    indo: "Maaf",
    pronounce: "[마앞]",
    meaning: "죄송합니다 / 실례합니다",
    example: "Maaf, saya terlambat.",
    exampleKo: "죄송합니다, 제가 늦었습니다."
  },
  {
    category: "daily",
    indo: "Berapa harganya?",
    pronounce: "[브라빠 하르가냐]",
    meaning: "얼마인가요?",
    example: "Berapa harganya ini?",
    exampleKo: "이것은 얼마인가요?"
  },
  {
    category: "daily",
    indo: "Enak sekali",
    pronounce: "[에낙 스깔리]",
    meaning: "정말 맛있어요",
    example: "Nasi goreng ini enak sekali!",
    exampleKo: "이 나시고랭 정말 맛있어요!"
  },
  {
    category: "numbers",
    indo: "Satu",
    pronounce: "[사뚜]",
    meaning: "1 (하나)",
    example: "Satu kopi, tolong.",
    exampleKo: "커피 한 잔 부탁합니다."
  },
  {
    category: "numbers",
    indo: "Dua",
    pronounce: "[두아]",
    meaning: "2 (둘)",
    example: "Dua tiket, tolong.",
    exampleKo: "표 두 장 부탁합니다."
  },
  {
    category: "numbers",
    indo: "Tiga",
    pronounce: "[띠가]",
    meaning: "3 (셋)",
    example: "Tiga orang.",
    exampleKo: "세 사람(세 명)."
  },
  {
    category: "numbers",
    indo: "Empat",
    pronounce: "[움빳]",
    meaning: "4 (넷)",
    example: "Jam empat sore.",
    exampleKo: "오후 네 시."
  },
  {
    category: "numbers",
    indo: "Lima",
    pronounce: "[리마]",
    meaning: "5 (다섯)",
    example: "Lima ribu Rupiah.",
    exampleKo: "5,000 루피아."
  }
];

// 카테고리 한글명 매핑
const categoryNames = {
  greeting: "기초 인사",
  daily: "필수 일상",
  numbers: "숫자"
};

// State 관리
let currentCategory = "all";
let filteredWords = [...wordList];
let currentCardIndex = 0;
let isFlipped = false;

// 퀴즈 관련 State
let quizQuestionIndex = 0;
const totalQuizQuestions = 5;
let quizScore = 0;
let currentQuizQuestion = null;

// =====================
// 모드 전환
// =====================
function switchMode(mode) {
  const flashcardTab = document.getElementById("tab-flashcard");
  const quizTab = document.getElementById("tab-quiz");
  const flashcardSec = document.getElementById("flashcard-section");
  const quizSec = document.getElementById("quiz-section");

  if (mode === "flashcard") {
    flashcardTab.classList.add("active");
    quizTab.classList.remove("active");
    flashcardSec.classList.add("active");
    quizSec.classList.remove("active");
  } else {
    quizTab.classList.add("active");
    flashcardTab.classList.remove("active");
    quizSec.classList.add("active");
    flashcardSec.classList.remove("active");
    startQuiz();
  }
}

// =====================
// 플래시 카드 기능
// =====================
function filterCategory(category) {
  currentCategory = category;

  // 버튼 스타일 변경
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.category === category);
  });

  if (category === "all") {
    filteredWords = [...wordList];
  } else {
    filteredWords = wordList.filter(item => item.category === category);
  }

  currentCardIndex = 0;
  isFlipped = false;
  document.getElementById("flashcard").classList.remove("flipped");
  renderCard();
}

function renderCard() {
  if (filteredWords.length === 0) return;

  const word = filteredWords[currentCardIndex];
  
  // 앞면
  document.getElementById("card-front-word").textContent = word.indo;
  document.getElementById("card-front-pronounce").textContent = word.pronounce;
  
  // 뒷면
  document.getElementById("card-back-tag").textContent = categoryNames[word.category] || "일반";
  document.getElementById("card-back-meaning").textContent = word.meaning;
  document.getElementById("card-back-example").textContent = word.example;
  document.getElementById("card-back-example-ko").textContent = word.exampleKo;

  // 카운터
  document.getElementById("card-counter").textContent = `${currentCardIndex + 1} / ${filteredWords.length}`;
}

function flipCard() {
  const card = document.getElementById("flashcard");
  isFlipped = !isFlipped;
  card.classList.toggle("flipped", isFlipped);
}

function prevCard() {
  if (currentCardIndex > 0) {
    currentCardIndex--;
  } else {
    currentCardIndex = filteredWords.length - 1; // 마지막 카드로 순환
  }
  resetCardFlip();
  renderCard();
}

function nextCard() {
  if (currentCardIndex < filteredWords.length - 1) {
    currentCardIndex++;
  } else {
    currentCardIndex = 0; // 처음 카드로 순환
  }
  resetCardFlip();
  renderCard();
}

function resetCardFlip() {
  isFlipped = false;
  document.getElementById("flashcard").classList.remove("flipped");
}

// 음성 발음 재생 (Web Speech API)
function speakWord(text) {
  if (!("speechSynthesis" in window)) {
    alert("이 브라우저는 음성 재생을 지원하지 않습니다.");
    return;
  }

  window.speechSynthesis.cancel(); // 이전 발음 중단
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "id-ID"; // 인도네시아어 코드
  utterance.rate = 0.9; // 약간 여유 있는 속도
  window.speechSynthesis.speak(utterance);
}

function speakCurrentWord(event) {
  event.stopPropagation(); // 카드 뒤집기 이벤트 방지
  if (filteredWords.length > 0) {
    speakWord(filteredWords[currentCardIndex].indo);
  }
}

// =====================
// 미니 퀴즈 기능
// =====================
function startQuiz() {
  quizQuestionIndex = 0;
  quizScore = 0;
  loadQuizQuestion();
}

function loadQuizQuestion() {
  const feedbackEl = document.getElementById("quiz-feedback");
  feedbackEl.textContent = "";
  feedbackEl.className = "quiz-feedback";
  document.getElementById("quiz-next-btn").style.display = "none";

  document.getElementById("quiz-counter").textContent = `문제 ${quizQuestionIndex + 1} / ${totalQuizQuestions}`;
  document.getElementById("quiz-score").textContent = `점수: ${quizScore}`;

  // 랜덤으로 문제 단어 선정
  const randomIndex = Math.floor(Math.random() * wordList.length);
  currentQuizQuestion = wordList[randomIndex];

  document.getElementById("quiz-word").textContent = currentQuizQuestion.indo;

  // 정답 1개 + 오답 3개 무작위 선택
  const wrongOptions = wordList
    .filter(item => item.meaning !== currentQuizQuestion.meaning)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(item => item.meaning);

  const options = [...wrongOptions, currentQuizQuestion.meaning].sort(() => Math.random() - 0.5);

  // 보기 버튼 렌더링
  const optionsContainer = document.getElementById("quiz-options");
  optionsContainer.innerHTML = "";

  options.forEach(optionText => {
    const btn = document.createElement("button");
    btn.className = "quiz-option-btn";
    btn.textContent = optionText;
    btn.onclick = () => selectQuizAnswer(btn, optionText);
    optionsContainer.appendChild(btn);
  });
}

function selectQuizAnswer(selectedBtn, answer) {
  const buttons = document.querySelectorAll(".quiz-option-btn");
  buttons.forEach(btn => (btn.disabled = true)); // 버튼 비활성화

  const feedbackEl = document.getElementById("quiz-feedback");
  const nextBtn = document.getElementById("quiz-next-btn");

  if (answer === currentQuizQuestion.meaning) {
    selectedBtn.classList.add("correct");
    feedbackEl.textContent = "🎉 정답입니다! (Hebat!)";
    feedbackEl.className = "quiz-feedback correct";
    quizScore += 20;
    document.getElementById("quiz-score").textContent = `점수: ${quizScore}`;
  } else {
    selectedBtn.classList.add("wrong");
    feedbackEl.textContent = `❌ 아쉬워요! 정답은: "${currentQuizQuestion.meaning}"`;
    feedbackEl.className = "quiz-feedback wrong";

    // 정답 버튼 표시
    buttons.forEach(btn => {
      if (btn.textContent === currentQuizQuestion.meaning) {
        btn.classList.add("correct");
      }
    });
  }

  nextBtn.style.display = "block";
  if (quizQuestionIndex + 1 >= totalQuizQuestions) {
    nextBtn.textContent = "결과 보기 🏆";
  } else {
    nextBtn.textContent = "다음 문제 ▶";
  }
}

function nextQuizQuestion() {
  quizQuestionIndex++;
  if (quizQuestionIndex < totalQuizQuestions) {
    loadQuizQuestion();
  } else {
    showQuizResult();
  }
}

function showQuizResult() {
  const optionsContainer = document.getElementById("quiz-options");
  optionsContainer.innerHTML = "";

  document.getElementById("quiz-counter").textContent = "퀴즈 완료!";
  document.getElementById("quiz-word").textContent = `최종 점수: ${quizScore} / 100점`;

  const feedbackEl = document.getElementById("quiz-feedback");
  if (quizScore >= 80) {
    feedbackEl.textContent = "🌟 훌륭해요! 인도네시아어 마스터에 한 걸음 다가갔습니다!";
  } else if (quizScore >= 40) {
    feedbackEl.textContent = "👍 잘하셨어요! 조금만 더 연습하면 완벽해요!";
  } else {
    feedbackEl.textContent = "💪 단어 카드로 한 번 더 복습해 보세요!";
  }
  feedbackEl.className = "quiz-feedback correct";

  const nextBtn = document.getElementById("quiz-next-btn");
  nextBtn.style.display = "block";
  nextBtn.textContent = "다시 풀기 🔄";
  nextBtn.onclick = () => {
    nextBtn.onclick = nextQuizQuestion;
    startQuiz();
  };
}

function speakQuizWord() {
  if (currentQuizQuestion) {
    speakWord(currentQuizQuestion.indo);
  }
}

// =====================
// 초기화
// =====================
document.addEventListener("DOMContentLoaded", () => {
  renderCard();
});
