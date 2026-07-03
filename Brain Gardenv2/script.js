// --- CONFIGURATION CENTRALIZED SERVER API ---
// Thay đổi URL này thành domain API .vercel.app thực tế của ông sau khi deploy thành công nhé!
const API_BASE = "https://brain-gardenv1.vercel.app/api"; 

// --- AUDIO ENGINE V2 CLEAN AUTOMATION ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const audioActiveRegistry = new Set(); 

function playSound(type) {
  if (!document.getElementById('soundToggle') || !document.getElementById('soundToggle').checked) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination);
  
  if (type === 'click') {
    osc.frequency.setValueAtTime(380, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
    osc.start(); osc.stop(audioCtx.currentTime + 0.05);
  } else if (type === 'success') {
    osc.frequency.setValueAtTime(500, audioCtx.currentTime);
    osc.frequency.setValueAtTime(680, audioCtx.currentTime + 0.07);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    osc.start(); osc.stop(audioCtx.currentTime + 0.22);
  } else if (type === 'fail') {
    osc.frequency.setValueAtTime(140, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    osc.start(); osc.stop(audioCtx.currentTime + 0.18);
  } else if (type === 'hover') {
    osc.frequency.setValueAtTime(580, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.003, audioCtx.currentTime); 
    osc.start(); osc.stop(audioCtx.currentTime + 0.02);
  }
}

document.addEventListener('mouseover', (e) => {
  const targetBtn = e.target.closest('button, .card, .node-btn, .menu-btn');
  if (targetBtn) {
    if (!audioActiveRegistry.has(targetBtn)) {
      audioActiveRegistry.add(targetBtn);
      playSound('hover');
    }
  }
});

document.addEventListener('mouseout', (e) => {
  const targetBtn = e.target.closest('button, .card, .node-btn, .menu-btn');
  if (targetBtn) {
    audioActiveRegistry.delete(targetBtn); 
  }
});

document.addEventListener('click', (e) => {
  if (e.target.closest('button, .card, .node-btn')) {
    playSound('click');
  }
});

// --- MASCOT QUOTES REGISTRY ---
const MASCOT_MOTIVATION_QUOTES = [
  "Cố lên nhé sĩ tử, tư duy logic sẽ đưa ta tới thành công!",
  "Học vấn là chiếc chìa khóa vạn năng mở toang cánh cửa vũ trụ.",
  "Đừng sợ sai! Mỗi lần vấp ngã là cây tri thức của bạn lại bén rễ sâu hơn.",
  "Tập trung cao độ nào! Bạn đang làm rất tốt, bộ não đang tiến hóa đó.",
  "Hãy đọc kỹ dữ kiện câu hỏi nhé, câu trả lời nằm ở sự nhạy bén của bạn."
];

function refreshMascotSpeech() {
  const bubble = document.getElementById("mascotBubble");
  if (bubble) {
    bubble.innerText = MASCOT_MOTIVATION_QUOTES[Math.floor(Math.random() * MASCOT_MOTIVATION_QUOTES.length)];
  }
}

// --- HIỆU ỨNG LÁ RỤNG 🌱 ---
function initFallingLeaves() {
  const container = document.getElementById("leavesContainer");
  if (!container) return;
  container.innerHTML = "";
  const leafCount = 18;
  const colors = ["#10b981", "#34d399", "#059669", "#84cc16", "#f59e0b"];
  
  for (let i = 0; i < leafCount; i++) {
    const leaf = document.createElement("div");
    leaf.className = "leaf";
    leaf.style.left = Math.random() * 100 + "%";
    leaf.style.top = Math.random() * -20 + "%";
    leaf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    leaf.style.transform = `scale(${Math.random() * 0.6 + 0.5})`;
    leaf.style.animationDelay = Math.random() * 8 + "s";
    leaf.style.animationDuration = (Math.random() * 5 + 6) + "s";
    container.appendChild(leaf);
  }
}

// --- TOAST NOTIFICATION ENGINE ---
function showToast(title, text, icon = "🎁", borderType = "#2563eb") {
  const container = document.getElementById("toastContainer");
  if(!container) return;
  const card = document.createElement("div");
  card.className = "toast-card";
  card.style.borderLeftColor = borderType;
  card.innerHTML = `<div style="font-size:1.5rem;">${icon}</div><div><h4 style="font-size:0.85rem;color:#fff;">${title}</h4><p style="font-size:0.75rem;color:#94a3b8;">${text}</p></div>`;
  container.appendChild(card);
  setTimeout(() => {
    card.style.opacity = '0'; card.style.transition = '0.3s';
    setTimeout(() => card.remove(), 300);
  }, 3500);
}

// --- STATE MANAGEMENT ENGINE V12.0 HYBRID ---
let currentWorld = "";
let currentQuestionIndex = 0;
let totalQuestionsInQuest = 10;
let currentUserData = null;
let activeLevel = 1;
let isReviewBattleMode = false;
let activePool = [];
let isGuestModeActive = false; 

let activeSessionStats = { correct: 0, wrong: 0, coinsEarned: 0, xpEarned: 0 };

function createNewUserProgress(username, nickname) {
  return {
    username: username,
    nickname: nickname || "Guest Keeper",
    avatar: "",
    coins: 100,
    lives: 3,
    xp: 0,
    level: 1,
    water: 4,
    fertilizer: 5,
    freezeCount: 1,
    streakCount: 0,
    lastStudiedDate: "",
    lastLoginDate: "",
    progress: { math: 1, eng: 1, hist: 1, iq: 1, chem: 1 },
    clearedNodes: { math: [], eng: [], hist: [], iq: [], chem: [] },
    garden: { level: 1, exp: 0 }
  };
}

function getRequiredXpForUser(lvl) { return 100 * Math.pow(4, lvl - 1); }
function getRequiredGpForTree(lvl) { return 100 * Math.pow(6, lvl - 1); }

function verifyDailyResetAndStreak() {
  if (!currentUserData) return;
  const todayStr = new Date().toISOString().split('T')[0];
  if (currentUserData.lastLoginDate !== todayStr) {
    currentUserData.lastLoginDate = todayStr;
    if (currentUserData.garden.level >= 4) {
      currentUserData.lives = 4;
      showToast("Mộc Thần Kích Hoạt Tier 4! ❤️", "Hồi phục toàn bộ 4 mạng sống ngày mới!", "☀️", "#ef4444");
    } else {
      currentUserData.lives = 3;
    }
  }
}

async function triggerStreakIncrement() {
  const todayStr = new Date().toISOString().split('T')[0];
  if (currentUserData.lastStudiedDate !== todayStr) {
    currentUserData.streakCount++;
    currentUserData.lastStudiedDate = todayStr;
    showToast("Tăng Chuỗi Học Tập! 🔥", `Liên tục đạt: ${currentUserData.streakCount} ngày!`, "⚡", "#f59e0b");
    
    if (currentUserData.garden.level >= 5 && currentUserData.streakCount % 3 === 0) {
      if (currentUserData.freezeCount < 2) {
        currentUserData.freezeCount++;
        showToast("Mộc Thần Kích Hoạt Tier 5! 🥶", "Nhận 1 Băng Bảo Vệ nhờ chuỗi học tập!", "❄️", "#0ea5e9");
      } else {
        currentUserData.coins += 50;
        showToast("Kho Băng Đã Đầy! 💰", "Tự động quy đổi sang +50 Xu thưởng!", "🪙", "#f59e0b");
      }
    }
  }
  await saveStateToStorage();
}

function handleGuestLogin() {
  isGuestModeActive = true;
  currentUserData = createNewUserProgress("guest_account@braingarden.io", "Học Viên Khách");
  localStorage.setItem("bg_remembered_session", "guest_session_active");
  localStorage.setItem("bg_user_guest_session_active", JSON.stringify(currentUserData));
  bootstrapAppView();
  showToast("Chế Độ Khách Kích Hoạt! 👥", "Bạn đang trải nghiệm nhanh. Hãy đăng ký tài khoản để lưu dữ liệu đám mây.", "🔓", "#0ea5e9");
}

// --- HIGH DIFFICULTY PROCEDURAL QUESTIONS ENGINE ---
function generateProceduralQuestions(world, level, isReview = false) {
  let list = [];
  let count = isReview ? 30 : 10;
  
  for(let i = 1; i <= count; i++) {
    let seed = level * 17 + i * 53;
    
    if (world === 'math') {
      let types = [
        { q: `Cho hình thang cân ABCD (AB // CD) có số đo góc A bằng ${105 + (seed%10)}°. Tính số đo góc C chính xác của hình thang?`, a: `${75 - (seed%10)}°`, wrongs: [`${105 + (seed%10)}°`, "90°", "180°"], ex: "In isosceles trapezoid, consecutive interior angles are supplementary." },
        { q: `Tam giác ABC có AB = ${4 + (seed%3)} cm, AC = ${8 + (seed%3)} cm. Đường phân giác trong góc A cắt BC tại D. Tính tỷ số độ dài cạnh DB / DC?`, a: "0.5", wrongs: ["2.0", "0.75", "1.25"], ex: "The angle bisector theorem states that an angle bisector divides the opposite side into elements proportional to the adjacent sides." },
        { q: `Định lý Thales: Cho tam giác ABC, một đường thẳng song song với cạnh BC cắt AB tại D và AC tại E. Biết AD = ${3 + (seed%2)} cm, DB = 3 cm, AE = 6 cm. Tính độ dài đoạn EC?`, a: `${parseFloat((18 / (3+(seed%2))).toFixed(2))} cm`, wrongs: ["4.0 cm", "2.5 cm", "5.0 cm"], ex: "According to Thales theorem: AD/DB = AE/EC." }
      ];
      let choice = types[seed % types.length];
      list.push({ q: choice.q, correct: choice.a, wrongs: choice.wrongs, ex: choice.ex });
    }
    else if (world === 'chem') {
      let types = [
        { q: `Đốt cháy hoàn toàn khí Mêtan (CH₄) trong bình chứa Ôxi dư. Xác định tổng các hệ số cân bằng tối giản của phương trình hóa học?`, a: "6", wrongs: ["5", "4", "7"], ex: "Reaction: CH₄ + 2O₂ → CO₂ + 2H₂O. Sum: 1 + 2 + 1 + 2 = 6." },
        { q: `Tính số mol nguyên tử tinh khiết chứa trong khối lượng ${(16.8 + (seed%3)*5.6).toFixed(1)} gam Sắt (Fe = 56)?`, a: `${((16.8 + (seed%3)*5.6) / 56).toFixed(2)} mol`, wrongs: ["0.20 mol", "0.50 mol", "1.00 mol"], ex: "Formula: n = m / M." }
      ];
      let choice = types[seed % types.length];
      list.push({ q: choice.q, correct: choice.a, wrongs: choice.wrongs, ex: choice.ex });
    }
    else if (world === 'eng') {
      let types = [
        { q: `Identify the grammatical error in the statement: 'The multi-layered tectonic plates moves incredibly slow across the mantle.'`, a: "moves (should be move)", wrongs: ["slow", "across", "multi-layered"], ex: "Plural subject 'plates' requires plural verb 'move'." },
        { q: `Choose the correct logical conjunction: 'The advanced laboratory experiment failed twice, ___ the engineering team refused to give up.'`, a: "yet", wrongs: ["because", "so", "or"], ex: "'Yet' presents a logical contrast between clauses." }
      ];
      let choice = types[seed % types.length];
      list.push({ q: choice.q, correct: choice.a, wrongs: choice.wrongs, ex: choice.ex });
    }
    else if (world === 'hist') {
      let types = [
        { q: `Sự kiện lịch sử lớn nào diễn ra từ năm 1914 đến năm 1918 mở đầu cho cuộc cục diện thế giới mới, mang tính chất đế quốc chủ nghĩa phi nghĩa?`, a: "Chiến tranh Thế giới I", wrongs: ["Chiến tranh Thế giới II", "Cách mạng Tháng Mười Nga", "Chiến tranh Giành Độc lập Bắc Mỹ"], ex: "World War I lasted from 1914 to 1918." },
        { q: `Sự kiện bùng nổ năm 1939 và kết thúc vào năm 1945 với sự thất bại hoàn toàn của khối Phát xít Đức, Ý, Nhật được gọi là gì?`, a: "Chiến tranh Thế giới II", wrongs: ["Chiến tranh Thế giới I", "Chiến tranh Lạnh", "Cách mạng Tư sản Pháp"], ex: "World War II ended in 1945 with Fascist defeat." },
        { q: `Dưới sự lãnh đạo tài tình của Đảng và Chủ tịch Hồ Chí Minh, cuộc tổng khởi nghĩa nào năm 1945 đã đập tan xiềng xích thực dân phát xít khai sinh ra nước Việt Nam Dân chủ Cộng hòa?`, a: "Cách mạng Tháng Tám", wrongs: ["Khởi nghĩa Yên Bái", "Phong trào Xô viết Nghệ Tĩnh", "Chiến dịch Điện Biên Phủ"], ex: "August Revolution established the independent nation." },
        { q: `Vị anh hùng dân tộc nào đã lãnh đạo nghĩa quân Lam Sơn đánh bại hoàn toàn quân xâm lược nhà Minh, giành lại độc lập và lập ra vương triều Hậu Lê?`, a: "Lê Lợi", wrongs: ["Trần Hưng Đạo", "Quang Trung", "Nguyễn Trãi"], ex: "Hero Le Loi led the Lam Son uprising victoriously." }
      ];
      let choice = types[seed % types.length];
      list.push({ q: choice.q, correct: choice.a, wrongs: choice.wrongs, ex: choice.ex });
    }
    else {
      let diffVal = (seed % 4) + 4;
      let start = level * 3;
      let s1 = start, s2 = start + diffVal, s3 = start + diffVal * 2, s4 = start + diffVal * 3;
      let ansVal = start + diffVal * 4;
      list.push({
        q: `Giải mã ma trận chuỗi số logic tăng trưởng cấp số cộng sau: ${s1}, ${s2}, ${s3}, ${s4}, [?]. Số cần tìm điền vào dấu hỏi chấm là:`,
        correct: `${ansVal}`, wrongs: [`${ansVal + diffVal}`, `${ansVal - 1}`, `${ansVal * 2}`],
        ex: `Arithmetic progression distance is +${diffVal}.`
      });
    }
  }
  return list;
}

// --- AUTH CORES CONTROLLER (FIXED HYBRID FOR BOTH CLOUD & LOCAL STORAGE) ---
function switchAuthTab(tab) {
  document.getElementById('tabLogin').classList.remove('active');
  document.getElementById('tabSignup').classList.remove('active');
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('signupForm').style.display = 'none';
  if (tab === 'login') {
    document.getElementById('tabLogin').classList.add('active');
    document.getElementById('loginForm').style.display = 'block';
  } else {
    document.getElementById('tabSignup').classList.add('active');
    document.getElementById('signupForm').style.display = 'block';
  }
}

async function handleAuth(mode) {
  if (mode === 'signup') {
    const nick = document.getElementById("signupNickname").value.trim();
    const user = document.getElementById("signupUser").value.trim();
    const pass = document.getElementById("signupPass").value.trim();
    if (!nick || !user || !pass) { alert("Vui lòng điền đủ trường!"); return; }
    
    const freshData = createNewUserProgress(user, nick);
    
    try {
      showToast("Đang xử lý...", "Gửi yêu cầu khởi tạo tài khoản lên Cloud", "⏳", "#3b82f6");
      const response = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass, profileData: freshData })
      });
      
      const resData = await response.json();
      if (!response.ok) { throw new Error(resData.message || "Lỗi tạo tài khoản Cloud."); }
      
      alert("Đăng ký hồ sơ Cloud thành công! Hãy tiến hành đăng nhập.");
      switchAuthTab('login');
    } catch (err) {
      // 🔥 CỨU NGUY: Tự chuyển sang lưu Offline vào ổ cứng nếu bị lỗi Fetch chặn bảo mật
      console.warn("Không kết nối được Server Cloud, tự động tạo tài khoản dạng Local Offline!", err);
      
      let localDB = JSON.parse(localStorage.getItem("bg_local_db") || "{}");
      if (localDB[user]) {
        alert("Tài khoản Gmail này đã được tạo cục bộ trên máy này từ trước!");
        return;
      }
      
      localDB[user] = { password: pass, profileData: freshData };
      localStorage.setItem("bg_local_db", JSON.stringify(localDB));
      
      isGuestModeActive = false;
      currentUserData = freshData;
      localStorage.setItem("bg_remembered_session", user);
      
      alert("Kích hoạt tài khoản Offline thành công! Tiến vào Học Viện...");
      bootstrapAppView();
    }
  } else {
    const user = document.getElementById("loginUser").value.trim();
    const pass = document.getElementById("loginPass").value.trim();
    if (!user || !pass) { alert("Vui lòng điền thông tin đăng nhập!"); return; }
    
    try {
      showToast("Đang xác thực...", "Kết nối máy chủ kiểm tra", "🔐", "#3b82f6");
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass })
      });
      
      const resData = await response.json();
      if (!response.ok) { throw new Error(resData.message || "Mật khẩu hoặc tài khoản sai."); }
      
      isGuestModeActive = false;
      currentUserData = resData.profileData; 
      localStorage.setItem("bg_remembered_session", user); 
      
      bootstrapAppView();
      showToast("Đăng Nhập Thành Công! 🎉", `Đã đồng bộ dữ liệu từ Server Cloud về máy này.`, "🔑", "#2563eb");
    } catch (err) {
      // 🔥 CỨU NGUY: Đọc database offline trong máy nếu không gọi được mạng
      console.warn("Lỗi mạng, đang tìm kiếm thông tin tài khoản Offline dưới máy...");
      let localDB = JSON.parse(localStorage.getItem("bg_local_db") || "{}");
      const account = localDB[user];
      
      if (account && account.password === pass) {
        isGuestModeActive = false;
        currentUserData = account.profileData;
        localStorage.setItem("bg_remembered_session", user);
        
        bootstrapAppView();
        showToast("Đăng Nhập Offline! 📂", "Đăng nhập bằng bản sao lưu cục bộ thành công.", "✔️", "#10b981");
      } else {
        alert("Đăng nhập thất bại: Tài khoản không chính xác hoặc máy chủ đang bảo trì!");
      }
    }
  }
}

function bootstrapAppView() {
  document.getElementById("authOverlay").style.display = "none";
  document.getElementById("mainApp").style.display = "flex";
  
  // FIX CHÍ MẠNG: Khử hoàn toàn chữ 'undefined' lỗi hiển thị tên
  let userNickname = currentUserData.nickname;
  if (!userNickname || userNickname === "undefined") {
    userNickname = currentUserData.username ? currentUserData.username.split('@')[0] : "Garden Keeper";
  }
  
  document.getElementById("displayUsername").innerText = userNickname;
  document.getElementById("displayAccount").innerText = currentUserData.username || "";
  
  if (currentUserData.avatar) {
    document.getElementById("avatarImg").src = currentUserData.avatar;
  }
  
  verifyDailyResetAndStreak();
  updateStatsUI();
  syncWorldProgressFill();
  renderTitlesModalData(); 
}

document.getElementById('avatarInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = async function(uploadEvent) {
      const base64Str = uploadEvent.target.result;
      document.getElementById('avatarImg').src = base64Str;
      if (currentUserData) {
        currentUserData.avatar = base64Str;
        await saveStateToStorage();
        showToast("Đã Lưu Avatar! 📷", "Ảnh đại diện cá nhân đã được đồng bộ hóa.", "✔️", "#10b981");
      }
    };
    reader.readAsDataURL(file);
  }
});

function handleLogout() {
  localStorage.removeItem("bg_remembered_session");
  localStorage.removeItem("bg_user_guest_session_active");
  location.reload();
}

// --- CLOUD & LOCAL DUAL SYNC ENGINE ---
async function saveStateToStorage() {
  if (!currentUserData) return;
  
  // Luôn ghi đè một bản backup an toàn vào ổ cứng máy tính trước
  if (currentUserData.username && !isGuestModeActive) {
    let localDB = JSON.parse(localStorage.getItem("bg_local_db") || "{}");
    if (localDB[currentUserData.username]) {
      localDB[currentUserData.username].profileData = currentUserData;
      localStorage.setItem("bg_local_db", JSON.stringify(localDB));
    }
  }

  if (isGuestModeActive) {
    localStorage.setItem("bg_user_guest_session_active", JSON.stringify(currentUserData));
    return;
  }
  
  // Đồng bộ song song lên đám mây Vercel
  try {
    const response = await fetch(`${API_BASE}/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: currentUserData.username, profileData: currentUserData })
    });
  } catch (err) {
    console.warn("Tạm thời ghi nhớ tiến trình chơi ở bộ nhớ Offline cục bộ.");
  }
}

// --- NAVIGATION CORES ---
function switchTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.menu-btn').forEach(el => el.classList.remove('active'));
  if (tab === 'world') {
    document.getElementById('worldTab').style.display = 'block';
    document.getElementById('zone').style.display = 'none';
  } else {
    document.getElementById(`${tab}Tab`).style.display = 'block';
    if(tab === 'garden') renderGarden();
  }
}

function enterWorld(world) {
  currentWorld = world;
  document.getElementById("worldTab").style.display = "none";
  document.getElementById("zone").style.display = "block";
  document.getElementById("zoneTitle").innerText = world.toUpperCase() + " ELITE ACADEMY";
  renderZoneNodes();
}

function back() {
  document.getElementById("zone").style.display = "none";
  document.getElementById("worldTab").style.display = "block";
}

function renderZoneNodes() {
  const container = document.getElementById("nodeMapContainer");
  if (!container) return;
  container.innerHTML = "";
  const maxUnlocked = currentUserData.progress[currentWorld] || 1;
  const clearedList = currentUserData.clearedNodes[currentWorld] || [];

  for (let i = 1; i <= 100; i++) {
    const node = document.createElement("div");
    let isReviewNode = (i % 10 === 0);
    let isLocked = (i > maxUnlocked);
    let isAlreadyCleared = clearedList.includes(i);
    
    node.className = `node-btn ${isReviewNode ? 'review-node' : ''} ${isLocked ? 'locked' : ''} ${isAlreadyCleared ? 'cleared' : ''}`;
    node.setAttribute("data-tooltip", isReviewNode ? `Bài kiểm tra tổng ôn siêu khó khóa 30 câu hỏi cấp độ ${i}` : `Thử thách học phần màn thứ ${i}`);
    
    node.onclick = () => {
      if (isLocked) {
        alert(`Ải Cấp ${i} đang bị khóa! Vui lòng hoàn thành tuần tự các ải trước đó.`);
        return;
      }
      startQuest(i, isReviewNode);
    };

    let titleNum = isReviewNode ? `★ ${i}` : i;
    let labelTag = isReviewNode ? "Tổng Ôn" : (isAlreadyCleared ? "Đã Đạt" : "Sẵn Sàng");
    if (isLocked) labelTag = "Khóa 🔒";

    node.innerHTML = `<div class="num">${titleNum}</div><div class="tag">${labelTag}</div>`;
    container.appendChild(node);
  }
}

// --- TASKBAR SYNCHRONIZER IN QUEST ---
function syncQuizTopBarHUD() {
  document.getElementById("barLives").innerText = currentUserData.lives;
  document.getElementById("barCoins").innerText = currentUserData.coins;
  document.getElementById("barStreak").innerText = currentUserData.streakCount;
}

function confirmExitQuiz() {
  if (confirm("Bạn có chắc chắn muốn thoát trận đấu? Tiến trình của cấp độ này sẽ không được tính điểm.")) {
    closeModal('quizModal');
  }
}

function startQuest(level, isReview) {
  activeLevel = level;
  isReviewBattleMode = isReview;
  currentQuestionIndex = 1;
  activePool = generateProceduralQuestions(currentWorld, level, isReview);
  totalQuestionsInQuest = activePool.length;
  
  activeSessionStats = { correct: 0, wrong: 0, coinsEarned: 0, xpEarned: 0 };
  
  document.getElementById("quizPlayContent").style.display = "block";
  document.getElementById("quizSummaryContent").style.display = "none";
  
  setupNextABCDQuestion();
  document.getElementById("quizModal").style.display = "flex";
}

function setupNextABCDQuestion() {
  const gridContainer = document.getElementById("answersContainer");
  const qTextElement = document.getElementById("question");
  
  gridContainer.classList.remove("disabled-lock");
  qTextElement.classList.remove("question-fade-anim");
  void qTextElement.offsetWidth; 
  qTextElement.classList.add("question-fade-anim");

  document.getElementById("quizIndex").innerText = `${currentQuestionIndex}/${totalQuestionsInQuest}`;
  document.getElementById("quizDiff").innerText = `${currentWorld.toUpperCase()} - CẤP ${activeLevel}`;

  syncQuizTopBarHUD();
  refreshMascotSpeech(); 

  const qData = activePool[currentQuestionIndex - 1];
  qTextElement.innerText = qData.q;
  
  const exBlock = document.getElementById("quizExBlock");
  if (qData.ex) {
    exBlock.innerHTML = `<div class="ex-badge">Ví dụ hỗ trợ tư duy (Ex)</div><div class="ex-body">${qData.ex}</div>`;
    exBlock.style.display = "block";
  } else {
    exBlock.style.display = "none";
  }

  let optionsArray = [
    { text: qData.correct, isCorrect: true },
    { text: qData.wrongs[0], isCorrect: false },
    { text: qData.wrongs[1], isCorrect: false },
    { text: qData.wrongs[2], isCorrect: false }
  ];

  for (let i = optionsArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [optionsArray[i], optionsArray[j]] = [optionsArray[j], optionsArray[i]];
  }

  gridContainer.innerHTML = "";
  const columnPrefixes = ["A", "B", "C", "D"];

  optionsArray.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.innerText = `${columnPrefixes[index]}. ${opt.text}`;
    if (opt.isCorrect) btn.setAttribute("data-is-true", "yes");
    
    btn.onclick = () => handleAnswerSubmission(btn, opt.isCorrect);
    gridContainer.appendChild(btn);
  });
}

async function handleAnswerSubmission(selectedButton, isCorrect) {
  const gridContainer = document.getElementById("answersContainer");
  gridContainer.classList.add("disabled-lock"); 

  const allButtons = gridContainer.querySelectorAll("button");
  
  if (isCorrect) {
    playSound('success');
    selectedButton.classList.add("correct-neon");
    activeSessionStats.correct++;
  } else {
    playSound('fail');
    selectedButton.classList.add("wrong-neon");
    activeSessionStats.wrong++;
    allButtons.forEach(b => {
      if (b.getAttribute("data-is-true") === "yes") {
        b.classList.add("correct-neon");
      }
    });
    
    currentUserData.lives--;
    syncQuizTopBarHUD();
    
    if (currentUserData.lives <= 0) {
      setTimeout(async () => {
        alert("❤️ Bạn đã cạn kiệt Mạng Sống! Tiến trình màn học bị gián đoạn.");
        closeModal('quizModal');
        currentUserData.lives = (currentUserData.garden.level >= 4) ? 4 : 3;
        await saveStateToStorage();
        updateStatsUI();
      }, 1500);
      return;
    }
  }

  setTimeout(async () => {
    if (currentQuestionIndex < totalQuestionsInQuest) {
      currentQuestionIndex++;
      setupNextABCDQuestion();
    } else {
      await processQuestVictory();
    }
    await saveStateToStorage();
  }, 1600);
}

async function processQuestVictory() {
  await triggerStreakIncrement();
  const clearedList = currentUserData.clearedNodes[currentWorld] || [];
  const isFirstTime = !clearedList.includes(activeLevel);

  let baseCoins = isReviewBattleMode ? 100 : 40;
  let baseXp = isReviewBattleMode ? 150 : 35;
  
  if (currentUserData.garden.level >= 2) baseXp = Math.round(baseXp * 1.05);
  if (currentUserData.garden.level >= 3) baseCoins = Math.round(baseCoins * 1.05);

  if (isFirstTime) {
    clearedList.push(activeLevel);
    currentUserData.clearedNodes[currentWorld] = clearedList;
    
    currentUserData.water += isReviewBattleMode ? 5 : 2;
    currentUserData.coins += baseCoins;
    currentUserData.xp += baseXp;
    
    activeSessionStats.coinsEarned = baseCoins;
    activeSessionStats.xpEarned = baseXp;
  } else {
    activeSessionStats.coinsEarned = 0;
    activeSessionStats.xpEarned = 0;
  }

  if (activeLevel === currentUserData.progress[currentWorld] && currentUserData.progress[currentWorld] < 100) {
    currentUserData.progress[currentWorld]++;
  }
  
  let requiredUserXp = getRequiredXpForUser(currentUserData.level);
  if (currentUserData.xp >= requiredUserXp) {
    currentUserData.xp -= requiredUserXp;
    currentUserData.level++;
    showToast("Tăng Cấp Học Viên Học Viện! 🚀", `Chúc mừng bạn đã tiến hóa lên cấp độ thế giới Level ${currentUserData.level}`, "👑", "#3b82f6");
  }
  
  document.getElementById("quizPlayContent").style.display = "none";
  document.getElementById("quizSummaryContent").style.display = "block";
  
  document.getElementById("sumCorrectCount").innerText = activeSessionStats.correct;
  document.getElementById("sumWrongCount").innerText = activeSessionStats.wrong;
  document.getElementById("sumCoinsEarned").innerText = `+${activeSessionStats.coinsEarned} Xu`;
  document.getElementById("sumXpEarned").innerText = `+${activeSessionStats.xpEarned} XP`;
  
  if (isFirstTime) {
    document.getElementById("summarySubText").innerText = "Chúc mừng bạn đã vượt qua thử thách học phần thành công!";
  } else {
    document.getElementById("summarySubText").innerText = "Học lại hoàn thành! Các ải đã thông không phát thêm xu/kinh nghiệm.";
  }

  await saveStateToStorage();
}

function closeSummaryAndExit() {
  closeModal('quizModal');
  if (document.getElementById("zone").style.display === "block") renderZoneNodes();
  updateStatsUI();
  syncWorldProgressFill();
  renderTitlesModalData();
}

// --- RENDER & REFRESH TITLES AND ACHIEVEMENTS SYSTEM ---
function renderTitlesModalData() {
  if (!currentUserData) return;
  const gLvl = currentUserData.garden.level || 1;
  const badgeElement = document.getElementById("userTitleBadge");
  
  const t2 = document.getElementById("titleShowcaseLvl2");
  const t5 = document.getElementById("titleShowcaseLvl5");
  
  let activeTitle = "Người Mới";
  
  if (gLvl >= 2) {
    if(t2) { t2.classList.remove("locked"); t2.classList.add("unlocked"); }
    activeTitle = "Người Làm Vườn";
  }
  if (gLvl >= 5) {
    if(t5) { t5.classList.remove("locked"); t5.classList.add("unlocked"); }
    activeTitle = "Bậc Thầy Sinh Thái";
  }
  
  if(badgeElement) {
    badgeElement.innerText = activeTitle;
  }
}

// --- GARDEN EVOLUTION SYSTEM ---
function renderGarden() {
  const lvl = currentUserData.garden.level || 1;
  
  const treeTiers = [
    { name: "🌱 Mầm Thần Khai Sáng", desc: "Aura xanh nhạt khơi mào dòng chảy tri thức.", icon: "🌱" },
    { name: "🌿 Cổ Thụ Thức Tỉnh", desc: "Cấu trúc sinh học tiến hóa, hấp thu hạt dữ liệu nền tảng.", icon: "🌿" },
    { name: "🌳 Đại Thụ Tri Thức", desc: "Tán lá ba chiều Hologram phát sáng rực rỡ góc trời sinh thái.", icon: "🌳" },
    { name: "🌸 Hoa Vương Tinh Vân", desc: "Tinh vân Nebula nở rộ, giải phóng dòng hạt năng lượng tư duy.", icon: "🌸" },
    { name: "👑 Thần Mộc Yggdrasil", desc: "Cấp độ tối cao! Kết nối toàn bộ tri thức đa vũ trụ vĩnh hằng.", icon: "👑✨" }
  ];
  
  const currentTier = treeTiers[lvl - 1] || treeTiers[4];
  const reqGp = getRequiredGpForTree(lvl);

  document.getElementById("gardenLvlText").innerText = lvl;
  document.getElementById("treeStage").innerText = currentTier.icon;
  document.getElementById("treeName").innerText = currentTier.name;
  document.getElementById("treeDesc").innerText = currentTier.desc;
  
  document.getElementById("treeProgress").style.width = `${Math.min(100, (currentUserData.garden.exp / reqGp) * 100)}%`;
  document.getElementById("gardenXpText").innerText = `${currentUserData.garden.exp} / ${reqGp} GP`;

  document.querySelectorAll(".buff-item").forEach(el => el.classList.remove("active"));
  for (let i = 1; i <= lvl; i++) {
    const item = document.getElementById(`buff-lv${i}`);
    if (item) item.classList.add("active");
  }
  renderTitlesModalData();
}

async function careTree(type) {
  let lvl = currentUserData.garden.level || 1;
  let reqGp = getRequiredGpForTree(lvl);

  if (type === 'water') {
    if (currentUserData.water > 0) { currentUserData.water--; currentUserData.garden.exp += 20; }
    else { alert("Kho trữ nước đã hết, hãy vượt qua ải học tập mới để tích lũy!"); return; }
  } else {
    if (currentUserData.fertilizer > 0) { currentUserData.fertilizer--; currentUserData.garden.exp += 35; }
    else { alert("Hết phân bón sinh học!"); return; }
  }
  
  while (currentUserData.garden.exp >= reqGp && currentUserData.garden.level < 5) {
    currentUserData.garden.exp -= reqGp;
    currentUserData.garden.level++;
    lvl = currentUserData.garden.level;
    reqGp = getRequiredGpForTree(lvl);
    showToast(`Thần Mộc Tiến Hóa Tier ${lvl}! 🌿`, `Đạt cấp độ sinh thái mới thành công!`, "🪴", "#10b981");
  }

  if (currentUserData.garden.level >= 5) {
    let maxGp = getRequiredGpForTree(5);
    if (currentUserData.garden.exp >= maxGp) {
      currentUserData.garden.exp = maxGp;
      showToast("Đạt Trạng Thái Cực Đại!", "Thần mộc đã đạt tới giới hạn tiến hóa vũ trụ tối cao.", "🌟", "#f59e0b");
    }
  }

  renderGarden(); 
  updateStatsUI(); 
  await saveStateToStorage();
}

// --- ANONYMOUS FEEDBACK SYSTEM ---
function submitFeedbackSystem() {
  const content = document.getElementById("feedbackTextarea").value.trim();
  if (!content) {
    alert("Vui lòng điền nội dung đóng góp trước khi gửi phản hồi!");
    return;
  }
  
  const mailtoAddress = "nguyenphamgiac@gmail.com";
  const emailSubject = encodeURIComponent("Brain Garden V11.0 - Ý Kiến Đóng Góp Phát Triển Hệ Thống");
  const emailBody = encodeURIComponent(`[HỆ THỐNG PHẢN HỒI ẨN DANH NGƯỜI DÙNG]\n\nNội dung ý kiến đóng góp:\n----------------------\n${content}\n----------------------`);
  
  window.open(`mailto:${mailtoAddress}?subject=${emailSubject}?body=${emailBody}`, '_blank');
  document.getElementById("feedbackTextarea").value = "";
  closeModal('feedbackModal');
}

// --- HUD RENDERING SYNCHRONIZER ---
function updateStatsUI() {
  if (!currentUserData) return;
  document.getElementById("coins").innerText = currentUserData.coins;
  document.getElementById("lives").innerText = currentUserData.lives;
  document.getElementById("streak").innerText = currentUserData.streakCount;
  document.getElementById("water").innerText = currentUserData.water;
  document.getElementById("fertilizer").innerText = currentUserData.fertilizer;
  document.getElementById("freezeCount").innerText = currentUserData.freezeCount;
  document.getElementById("userLevel").innerText = `Level ${currentUserData.level}`;
  
  const reqXp = getRequiredXpForUser(currentUserData.level);
  document.getElementById("xpFill").style.width = `${(currentUserData.xp / reqXp) * 100}%`;
  document.getElementById("xpText").innerText = `${Math.round(currentUserData.xp)} / ${reqXp} XP`;
}

function syncWorldProgressFill() {
  ['math', 'eng', 'hist', 'iq', 'chem'].forEach(subj => {
    const lv = currentUserData.progress[subj] || 1;
    const bar = document.getElementById(`progress-${subj}`);
    if(bar) bar.style.width = `${((lv - 1) / 100) * 100}%`;
  });
}

function openModal(id) { document.getElementById(id).style.display = "flex"; }
function closeModal(id) { document.getElementById(id).style.display = "none"; }

// --- KHÔI PHỤC PHIÊN LÀM VIỆC TỰ ĐỘNG KHỞI ĐỘNG (FIXED HYBRID LOAD) ---
window.onload = async function() {
  initFallingLeaves(); 
  
  const rememberedUser = localStorage.getItem("bg_remembered_session");
  if (rememberedUser) {
    if (rememberedUser === "guest_session_active") {
      isGuestModeActive = true;
      const data = localStorage.getItem("bg_user_guest_session_active");
      if (data) { currentUserData = JSON.parse(data); bootstrapAppView(); }
    } else {
      // Thử kết nối lên Cloud Vercel để lấy bản sao lưu mới nhất trước
      try {
        const response = await fetch(`${API_BASE}/load?username=${encodeURIComponent(rememberedUser)}`);
        if (response.ok) {
          const resData = await response.json();
          currentUserData = resData.profileData;
          bootstrapAppView();
          return; // Thoát hàm nếu tải thành công dữ liệu trực tuyến
        }
      } catch (err) {
        console.log("Đang mở file cục bộ hoặc đứt mạng, chuyển sang cơ chế dự phòng nạp dữ liệu từ máy...");
      }
      
      // HÀM BỌC HẬU CỨU NGUY: Lấy dữ liệu lưu trực tiếp từ ổ cứng nếu Cloud bị lỗi/bị chặn CORS
      let localDB = JSON.parse(localStorage.getItem("bg_local_db") || "{}");
      if (localDB[rememberedUser]) {
        currentUserData = localDB[rememberedUser].profileData;
        bootstrapAppView();
      } else {
        document.getElementById("authOverlay").style.display = "flex";
      }
    }
  } else {
    document.getElementById("authOverlay").style.display = "flex";
  }
};