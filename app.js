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

const categoryNames = {
  greeting: "기초 인사",
  daily: "필수 일상",
  numbers: "숫자"
};

// 플래시카드 State
let currentCategory = "all";
let filteredWords = [...wordList];
let currentCardIndex = 0;
let isFlipped = false;

// 퀴즈 State
let quizQuestionIndex = 0;
const totalQuizQuestions = 5;
let quizScore = 0;
let currentQuizQuestion = null;

// =========================================
// Gemini API & 모델 State
// =========================================
const API_STORAGE_KEY = "halo_indo_gemini_api_key";
const MODEL_STORAGE_KEY = "halo_indo_gemini_model";

// 기본 모델: gemini-3.8-flash (지원: gemini-3.8-flash, gemini-3.5-flash-lite)
let currentModel = localStorage.getItem(MODEL_STORAGE_KEY) || "gemini-3.8-flash";
let geminiApiKey = localStorage.getItem(API_STORAGE_KEY) || "";

// =====================
// 모드 전환
// =====================
function switchMode(mode) {
  const tabs = {
    flashcard: document.getElementById("tab-flashcard"),
    quiz: document.getElementById("tab-quiz"),
    ai: document.getElementById("tab-ai")
  };

  const sections = {
    flashcard: document.getElementById("flashcard-section"),
    quiz: document.getElementById("quiz-section"),
    ai: document.getElementById("ai-section")
  };

  Object.keys(tabs).forEach(key => {
    tabs[key].classList.toggle("active", key === mode);
    sections[key].classList.toggle("active", key === mode);
  });

  if (mode === "quiz") {
    startQuiz();
  } else if (mode === "ai") {
    checkApiKeyUI();
    updateModelUI();
  }
}

// =====================
// 플래시 카드 기능
// =====================
function filterCategory(category) {
  currentCategory = category;

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
  
  document.getElementById("card-front-word").textContent = word.indo;
  document.getElementById("card-front-pronounce").textContent = word.pronounce;
  
  document.getElementById("card-back-tag").textContent = categoryNames[word.category] || "일반";
  document.getElementById("card-back-meaning").textContent = word.meaning;
  document.getElementById("card-back-example").textContent = word.example;
  document.getElementById("card-back-example-ko").textContent = word.exampleKo;

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
    currentCardIndex = filteredWords.length - 1;
  }
  resetCardFlip();
  renderCard();
}

function nextCard() {
  if (currentCardIndex < filteredWords.length - 1) {
    currentCardIndex++;
  } else {
    currentCardIndex = 0;
  }
  resetCardFlip();
  renderCard();
}

function resetCardFlip() {
  isFlipped = false;
  document.getElementById("flashcard").classList.remove("flipped");
}

function speakWord(text) {
  if (!("speechSynthesis" in window)) {
    alert("이 브라우저는 음성 재생을 지원하지 않습니다.");
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "id-ID";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

function speakCurrentWord(event) {
  event.stopPropagation();
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

  const randomIndex = Math.floor(Math.random() * wordList.length);
  currentQuizQuestion = wordList[randomIndex];

  document.getElementById("quiz-word").textContent = currentQuizQuestion.indo;

  const wrongOptions = wordList
    .filter(item => item.meaning !== currentQuizQuestion.meaning)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(item => item.meaning);

  const options = [...wrongOptions, currentQuizQuestion.meaning].sort(() => Math.random() - 0.5);

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
  buttons.forEach(btn => (btn.disabled = true));

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

// =========================================
// Gemini AI 튜터 & 모델 선택 기능
// =========================================
function changeModel(newModel) {
  currentModel = newModel;
  localStorage.setItem(MODEL_STORAGE_KEY, currentModel);
  updateModelUI();
  appendChatMessage("ai", `🔄 사용할 AI 모델이 **${currentModel}**(으)로 변경되었습니다!`);
}

function updateModelUI() {
  const selectEl = document.getElementById("gemini-model-select");
  if (selectEl) {
    selectEl.value = currentModel;
  }

  const welcomeModelName = document.getElementById("welcome-model-name");
  if (welcomeModelName) {
    welcomeModelName.textContent = currentModel;
  }

  const indicator = document.getElementById("model-status-indicator");
  if (indicator) {
    if (currentModel === "gemini-3.5-flash-lite") {
      indicator.textContent = "⚡ 초경량·고속";
      indicator.style.background = "#fff3e0";
      indicator.style.color = "#e65100";
    } else {
      indicator.textContent = "🚀 고성능·표준";
      indicator.style.background = "#e3f2fd";
      indicator.style.color = "#1976d2";
    }
  }
}

function checkApiKeyUI() {
  const badge = document.getElementById("api-key-badge");
  const notice = document.getElementById("api-notice");

  if (geminiApiKey) {
    badge.textContent = "🔑 API 키 설정됨 ✓";
    badge.classList.add("configured");
    if (notice) notice.style.display = "none";
  } else {
    badge.textContent = "🔑 API 키 설정";
    badge.classList.remove("configured");
    if (notice) notice.style.display = "flex";
  }
}

function toggleApiKeyModal() {
  const modal = document.getElementById("api-modal");
  modal.classList.toggle("open");
  if (modal.classList.contains("open")) {
    document.getElementById("gemini-key-input").value = geminiApiKey || "";
  }
}

function openApiKeyModal() {
  const modal = document.getElementById("api-modal");
  modal.classList.add("open");
  document.getElementById("gemini-key-input").value = geminiApiKey || "";
}

function closeApiKeyModal() {
  document.getElementById("api-modal").classList.remove("open");
}

function closeModalOnBackdrop(event) {
  if (event.target.id === "api-modal") {
    closeApiKeyModal();
  }
}

function saveApiKey() {
  const inputVal = document.getElementById("gemini-key-input").value.trim();
  if (!inputVal) {
    alert("API 키를 입력해주세요.");
    return;
  }
  geminiApiKey = inputVal;
  localStorage.setItem(API_STORAGE_KEY, geminiApiKey);
  checkApiKeyUI();
  closeApiKeyModal();
  alert("Gemini API 키가 안전하게 브라우저에 저장되었습니다!");
}

function clearApiKey() {
  if (confirm("저장된 API 키를 삭제하시겠습니까?")) {
    geminiApiKey = "";
    localStorage.removeItem(API_STORAGE_KEY);
    document.getElementById("gemini-key-input").value = "";
    checkApiKeyUI();
    closeApiKeyModal();
  }
}

// 추천 질문 클릭
function sendQuickPrompt(promptText) {
  document.getElementById("chat-input").value = promptText;
  sendMessage();
}

function handleChatKeyDown(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}

async function sendMessage() {
  const inputEl = document.getElementById("chat-input");
  const messageText = inputEl.value.trim();
  if (!messageText) return;

  if (!geminiApiKey) {
    openApiKeyModal();
    alert("AI 튜터를 이용하시려면 먼저 Gemini API 키를 입력해주세요!");
    return;
  }

  // 사용자 메시지 화면 표시
  appendChatMessage("user", messageText);
  inputEl.value = "";

  // 로딩 상태 표시
  const loadingEl = document.getElementById("ai-loading");
  const loadingText = document.getElementById("loading-text");
  if (loadingText) {
    loadingText.textContent = `${currentModel} 모델로 답변 생성 중...`;
  }
  loadingEl.style.display = "flex";
  scrollChatToBottom();

  try {
    const reply = await callGeminiAPI(messageText);
    appendChatMessage("ai", reply);
  } catch (error) {
    console.error("Gemini API Error:", error);
    appendChatMessage("ai", `❌ 오류가 발생했습니다 (${currentModel}): ${error.message}\nAPI 키가 올바른지 확인해주세요.`);
  } finally {
    loadingEl.style.display = "none";
    scrollChatToBottom();
  }
}

function appendChatMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");
  const messageDiv = document.createElement("div");
  messageDiv.className = `chat-message ${sender}-message`;

  const avatarDiv = document.createElement("div");
  avatarDiv.className = "chat-avatar";
  avatarDiv.textContent = sender === "ai" ? "🤖" : "👤";

  const bubbleDiv = document.createElement("div");
  bubbleDiv.className = "chat-bubble";
  bubbleDiv.innerHTML = formatMarkdownText(text);

  messageDiv.appendChild(avatarDiv);
  messageDiv.appendChild(bubbleDiv);
  chatBox.appendChild(messageDiv);
  scrollChatToBottom();
}

function scrollChatToBottom() {
  const chatBox = document.getElementById("chat-box");
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 간단 텍스트 줄바꿈/볼드 처리
function formatMarkdownText(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}

// =========================================
// Gemini API 직접 호출 (선택된 currentModel 사용)
// =========================================
async function callGeminiAPI(userQuery) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${geminiApiKey}`;

  const systemInstruction = 
    "당신은 친절하고 똑똑한 인도네시아어 전문 AI 튜터 '바틱(Batik)'입니다. " +
    "사용자의 질문에 맞춰 인도네시아어 표현, 한국어 발음 표기, 뜻, 뉘앙스, 실생활 활용 예시를 간결하고 보기 쉽게 설명해주세요. " +
    "친절하고 상냥한 어조로 가르쳐주세요.";

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: userQuery
          }
        ]
      }
    ],
    systemInstruction: {
      parts: [
        {
          text: systemInstruction
        }
      ]
    }
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const errMsg = errData.error?.message || `HTTP ${response.status} 오류`;
    throw new Error(errMsg);
  }

  const data = await response.json();
  const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!candidate) {
    throw new Error("AI 응답을 받아오지 못했습니다.");
  }

  return candidate;
}

// =====================
// 초기화
// =====================
document.addEventListener("DOMContentLoaded", () => {
  renderCard();
  checkApiKeyUI();
  updateModelUI();
});
