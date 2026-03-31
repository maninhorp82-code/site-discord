const audio = document.getElementById("profile-audio");
const toggleButton = document.getElementById("toggle-audio");
const swapTrackButton = document.getElementById("swap-track");
const playerStatus = document.getElementById("player-status");
const volumeSlider = document.getElementById("volume-slider");
const timelineSlider = document.getElementById("timeline-slider");
const currentTimeLabel = document.getElementById("current-time");
const totalTimeLabel = document.getElementById("total-time");
const introScreen = document.getElementById("intro-screen");
const enterSiteButton = document.getElementById("enter-site");
const toggleDuckButton = document.getElementById("toggle-duck");
const kissCat = document.getElementById("kiss-cat");
const miniEq = document.getElementById("mini-eq");
const trackName = document.getElementById("track-name");
const coverImage = document.getElementById("cover-image");
const clockTime = document.getElementById("clock-time");
const clockTagline = document.getElementById("clock-tagline");
const heartTrail = document.getElementById("heart-trail");
const heartRain = document.getElementById("heart-rain");
const petCat = document.getElementById("pet-cat");
const petCountLabel = document.getElementById("pet-count");
const petCatMessage = document.getElementById("pet-cat-message");
const duckChaser = document.getElementById("duck-chaser");
const duckCursor = document.getElementById("duck-cursor");

const tracks = [
  {
    title: "Haley Reinhart - Creep",
    audioSrc: "./media/Creep%20-%20Vintage%20Postmodern%20Jukebox%20Radiohead%20Cover%20ft.%20Haley%20Reinhart%20-%20PostmodernJukebox%20%28youtube%29.mp3",
    coverSrc: "./media/Creep%20-%20Vintage%20Postmodern%20Jukebox%20Radiohead%20Cover%20ft_%20Haley%20Reinhart.jfif",
    coverAlt: "Capa da musica Creep por Haley Reinhart",
  },
  {
    title: "Adele - Someone Like You",
    audioSrc: "./media/Adele%20-%20Someone%20Like%20You%20%28Official%20Music%20Video%29%20-%20Adele%20%28youtube%29.mp3",
    coverSrc: "./media/Adele%2021.jfif",
    coverAlt: "Capa do album Adele 21",
  },
];

let currentTrackIndex = 0;
let lastHeartTimestamp = 0;
let hasEnteredSite = false;
let duckModeEnabled = false;
let lastPointerPosition = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
let isDuckSequenceRunning = false;
let petMessageTimeoutId = null;
let remainingPetMessages = [];
let petCount = 0;
let heartRainUnlocked = false;
let purrTimeoutId = null;
let purrAudioStopTimeoutId = null;
let specialMeowTimeoutId = null;
const petPurrAudio = new Audio("./dragon-studio-purring-cat-401727.mp3");

const petMessages = [
  "miau... gostei disso",
  "mais carinho, por favor",
  "voce achou meu cantinho",
  "esse carinho ta perfeito",
  "miau fofinho pra voce",
  "eu tava esperando voce",
  "carinho aprovado",
  "que mao quentinha",
  "fica mais um pouquinho",
  "voce e bem gentil",
  "eu ronronei aqui",
  "isso ta muito bom",
  "agora sim eu relaxei",
  "nao para agora nao",
  "voce ganhou meu coracao",
  "um miau so pra voce",
  "to me sentindo amado",
  "seu carinho curou tudo",
  "esse site ficou aconchegante",
  "minha vibe favorita chegou",
  "voce faz carinho direitinho",
  "meu humor subiu agora",
  "mais disso, humano fofo",
  "ronrom mode on",
  "eu confiaria em voce",
  "seu toque e fofinho",
  "me senti especial agora",
  "esse cantinho e seguro",
  "voce desbloqueou meu miau",
  "a energia daqui ta boa",
  "deu vontade de dormir aqui",
  "carinho de qualidade rara",
  "se continuar eu derreto",
  "minhas patinhas aprovaram",
  "voce tem aura boa",
  "me senti chique agora",
  "isso foi fofo demais",
  "hoje eu sou seu fã",
  "te adotei em silencio",
  "miau de gratidao",
  "agora to feliz de verdade",
  "seu carinho tem buff",
  "nota maxima pro carinho",
  "foi um carinho premium",
  "isso merece mais coracoes",
];

function getNextPetMessage() {
  if (remainingPetMessages.length === 0) {
    remainingPetMessages = [...petMessages];

    for (let index = remainingPetMessages.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [remainingPetMessages[index], remainingPetMessages[randomIndex]] = [remainingPetMessages[randomIndex], remainingPetMessages[index]];
    }
  }

  return remainingPetMessages.pop();
}

audio.volume = 0.65;
kissCat.muted = true;
kissCat.loop = false;
kissCat.hidden = true;
petPurrAudio.preload = "auto";
petPurrAudio.volume = 0.55;

function formatTime(timeInSeconds) {
  if (!Number.isFinite(timeInSeconds)) {
    return "0:00";
  }

  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function paintSlider(slider, progress, activeColor, restColor) {
  slider.style.background = `linear-gradient(90deg, ${activeColor} 0%, ${activeColor} ${progress}%, ${restColor} ${progress}%, ${restColor} 100%)`;
}

function setEqualizerState(isPlaying) {
  miniEq.classList.toggle("is-playing", isPlaying);
}

function updateClock() {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  clockTime.textContent = formatter.format(new Date());
}

function applyMood(index) {
  document.body.classList.remove("mood-creep", "mood-adele");

  if (index === 0) {
    document.body.classList.add("mood-creep");
    clockTagline.textContent = "midnight mood";
    return;
  }

  document.body.classList.add("mood-adele");
  clockTagline.textContent = "soft echoes";
}

function applyTrack(index) {
  const track = tracks[index];
  const shouldResume = !audio.paused;

  currentTrackIndex = index;
  applyMood(index);
  audio.src = track.audioSrc;
  audio.load();
  trackName.textContent = track.title;
  coverImage.src = track.coverSrc;
  coverImage.alt = track.coverAlt;
  playerStatus.textContent = "Faixa trocada.";
  timelineSlider.value = "0";
  currentTimeLabel.textContent = "0:00";
  totalTimeLabel.textContent = "0:00";
  paintSlider(timelineSlider, 0, "#f5f5f5", "#5e5e5e");

  if (shouldResume) {
    startAudio();
  } else {
    setEqualizerState(false);
  }
}

function updateTimelineProgress() {
  if (!audio.duration) {
    timelineSlider.value = "0";
    currentTimeLabel.textContent = "0:00";
    totalTimeLabel.textContent = "0:00";
    paintSlider(timelineSlider, 0, "#f5f5f5", "#5e5e5e");
    return;
  }

  const progress = (audio.currentTime / audio.duration) * 100;
  timelineSlider.value = String(progress);
  currentTimeLabel.textContent = formatTime(audio.currentTime);
  totalTimeLabel.textContent = formatTime(audio.duration);
  paintSlider(timelineSlider, progress, "#f5f5f5", "#5e5e5e");
}

async function startAudio() {
  try {
    await audio.play();
    toggleButton.textContent = "Pausar musica";
    playerStatus.textContent = "Musica tocando.";
    setEqualizerState(true);
  } catch (error) {
    toggleButton.textContent = "Tocar musica";
    playerStatus.textContent = "O navegador bloqueou o autoplay. Clique no botao para tocar.";
    setEqualizerState(false);
  }
}

async function closeIntroAndStart() {
  if (isDuckSequenceRunning) {
    return;
  }

  isDuckSequenceRunning = true;
  const shouldRunDuck = duckModeEnabled;

  introScreen.classList.add("is-leaving");
  document.body.classList.add("intro-finished");
  document.body.classList.add("cat-jumpscare");
  hasEnteredSite = true;
  duckModeEnabled = false;
  toggleDuckButton.classList.remove("is-active");
  toggleDuckButton.textContent = "Pato troll: off";
  kissCat.hidden = false;
  kissCat.currentTime = 0;
  kissCat.classList.add("is-visible");
  kissCat.play().catch(() => {});
  await startAudio();

  window.setTimeout(() => {
    introScreen.hidden = true;
  }, 700);

  await wait(Math.max(2200, (kissCat.duration || 0) * 1000 || 3000));

  if (shouldRunDuck) {
    await runDuckSequence();
  }

  duckChaser.classList.remove("is-active");
  duckCursor.classList.remove("is-active");

  window.setTimeout(() => {
    document.body.classList.remove("cat-jumpscare");
  }, 420);

  isDuckSequenceRunning = false;
}

function spawnHeart(x, y) {
  const heart = document.createElement("span");
  const offsetX = (Math.random() - 0.5) * 18;
  const offsetY = Math.random() * -10;
  const scale = (0.82 + Math.random() * 0.42).toFixed(2);

  heart.className = "trail-heart";
  heart.style.left = `${x + offsetX}px`;
  heart.style.top = `${y + offsetY}px`;
  heart.style.transform = `translate(-50%, -50%) scale(${scale})`;
  heartTrail.appendChild(heart);

  window.setTimeout(() => {
    heart.remove();
  }, 780);
}

function petCatReact() {
  petCat.classList.remove("is-purring");
  window.requestAnimationFrame(() => {
    petCat.classList.add("is-purring");
  });

  if (purrTimeoutId) {
    window.clearTimeout(purrTimeoutId);
  }

  purrTimeoutId = window.setTimeout(() => {
    petCat.classList.remove("is-purring");
  }, 760);
}

function playPurrSound() {
  if (!petPurrAudio.paused && petPurrAudio.currentTime < 0.9) {
    return;
  }

  if (purrAudioStopTimeoutId) {
    window.clearTimeout(purrAudioStopTimeoutId);
  }

  petPurrAudio.currentTime = 0;
  petPurrAudio.play().catch(() => {});
  purrAudioStopTimeoutId = window.setTimeout(() => {
    petPurrAudio.pause();
    petPurrAudio.currentTime = 0;
  }, 2000);
}

function playSpecialMeow() {
  if (purrAudioStopTimeoutId) {
    window.clearTimeout(purrAudioStopTimeoutId);
  }

  if (specialMeowTimeoutId) {
    window.clearTimeout(specialMeowTimeoutId);
  }

  petPurrAudio.pause();
  petPurrAudio.currentTime = 0.92;
  petPurrAudio.volume = 0.72;
  petPurrAudio.play().catch(() => {});

  specialMeowTimeoutId = window.setTimeout(() => {
    petPurrAudio.pause();
    petPurrAudio.currentTime = 0;
    petPurrAudio.volume = 0.55;
  }, 900);
}

function showPetMessage(customMessage) {
  const message = customMessage || getNextPetMessage();
  petCatMessage.textContent = message;
  petCatMessage.classList.add("is-visible");

  if (petMessageTimeoutId) {
    window.clearTimeout(petMessageTimeoutId);
  }

  petMessageTimeoutId = window.setTimeout(() => {
    petCatMessage.classList.remove("is-visible");
  }, 1800);
}

function triggerHeartRain() {
  for (let index = 0; index < 42; index += 1) {
    const heart = document.createElement("span");
    const size = 14 + Math.random() * 20;
    const left = Math.random() * 100;
    const duration = 1800 + Math.random() * 2200;
    const delay = Math.random() * 700;

    heart.className = "rain-heart";
    heart.style.left = `${left}vw`;
    heart.style.fontSize = `${size}px`;
    heart.style.animationDuration = `${duration}ms`;
    heart.style.animationDelay = `${delay}ms`;
    heartRain.appendChild(heart);

    window.setTimeout(() => {
      heart.remove();
    }, duration + delay + 120);
  }
}

function updatePetCountLabel() {
  petCountLabel.textContent = `${petCount} carinhos`;
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function placeDuck(x, y, angle = 0) {
  duckChaser.style.left = `${x}px`;
  duckChaser.style.top = `${y}px`;
  duckChaser.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(0.96)`;
}

function placeDuckCursor(x, y) {
  duckCursor.style.left = `${x}px`;
  duckCursor.style.top = `${y}px`;
}

async function runDuckSequence() {
  const startX = lastPointerPosition.x;
  const startY = lastPointerPosition.y;
  const petRect = petCat.getBoundingClientRect();
  const targetX = petRect.left + petRect.width / 2 - 6;
  const targetY = petRect.top + petRect.height / 2 - 10;
  const steps = 68;

  document.body.classList.add("duck-sequence");
  duckChaser.classList.add("is-active");
  duckCursor.classList.add("is-active");
  placeDuck(startX - 48, startY + 22, 0);
  placeDuckCursor(startX, startY);

  await wait(220);

  for (let step = 0; step <= steps; step += 1) {
    const progress = step / steps;
    const eased = 1 - (1 - progress) ** 2.1;
    const x = startX + (targetX - startX) * eased;
    const yBase = startY + (targetY - startY) * eased;
    const arc = Math.sin(progress * Math.PI) * 40;
    const y = yBase - arc;
    const nextX = startX + (targetX - startX) * Math.min(1, eased + 0.02);
    const nextY = startY + (targetY - startY) * Math.min(1, eased + 0.02);
    const angle = Math.atan2(nextY - y, nextX - x) * (180 / Math.PI);

    placeDuckCursor(x, y);
    placeDuck(x - 42, y + 20, angle * 0.28);
    await wait(22);
  }

  petCatReact();
  showPetMessage("miau... achei o carinho");
  spawnHeart(targetX, targetY);
  spawnHeart(targetX - 16, targetY - 3);
  spawnHeart(targetX + 16, targetY - 3);
  await wait(520);

  duckChaser.classList.remove("is-active");
  duckCursor.classList.remove("is-active");
  document.body.classList.remove("duck-sequence");
}

toggleButton.addEventListener("click", async () => {
  if (audio.paused) {
    await startAudio();
    return;
  }

  audio.pause();
  toggleButton.textContent = "Tocar musica";
  playerStatus.textContent = "Musica pausada.";
  setEqualizerState(false);
});

swapTrackButton.addEventListener("click", () => {
  const nextTrackIndex = (currentTrackIndex + 1) % tracks.length;
  applyTrack(nextTrackIndex);
});

volumeSlider.addEventListener("input", (event) => {
  const progress = Number(event.target.value);
  audio.volume = progress / 100;
  paintSlider(volumeSlider, progress, "#ffffff", "#5e5e5e");
});

timelineSlider.addEventListener("input", (event) => {
  if (!audio.duration) {
    return;
  }

  const progress = Number(event.target.value);
  audio.currentTime = (progress / 100) * audio.duration;
  updateTimelineProgress();
});

audio.addEventListener("loadedmetadata", updateTimelineProgress);
audio.addEventListener("timeupdate", updateTimelineProgress);
audio.addEventListener("ended", () => {
  updateTimelineProgress();
  setEqualizerState(false);
});

audio.addEventListener("error", () => {
  toggleButton.textContent = "Arquivo ausente";
  toggleButton.disabled = true;
  volumeSlider.disabled = true;
  timelineSlider.disabled = true;
  playerStatus.textContent = "Verifique se a musica ainda esta na pasta media para ativar o player.";
  setEqualizerState(false);
});

enterSiteButton.addEventListener("click", closeIntroAndStart);
introScreen.addEventListener("click", (event) => {
  if (event.target === introScreen) {
    closeIntroAndStart();
  }
});

toggleDuckButton.addEventListener("click", () => {
  duckModeEnabled = !duckModeEnabled;
  toggleDuckButton.classList.toggle("is-active", duckModeEnabled);
  toggleDuckButton.textContent = duckModeEnabled ? "Pato troll: on" : "Pato troll: off";
});

window.addEventListener("pointermove", (event) => {
  lastPointerPosition.x = event.clientX;
  lastPointerPosition.y = event.clientY;

  if (!hasEnteredSite) {
    return;
  }

  const now = performance.now();
  if (now - lastHeartTimestamp < 58) {
    return;
  }

  lastHeartTimestamp = now;
  spawnHeart(event.clientX, event.clientY);
});

petCat.addEventListener("mouseenter", () => {
  showPetMessage();
});
petCat.addEventListener("click", () => {
  petCount += 1;
  updatePetCountLabel();
  petCatReact();
  playPurrSound();
  showPetMessage("mais carinho, humano");

  const rect = petCat.getBoundingClientRect();
  spawnHeart(rect.left + rect.width / 2, rect.top + 8);
  spawnHeart(rect.left + rect.width / 2 - 14, rect.top + 2);
  spawnHeart(rect.left + rect.width / 2 + 14, rect.top + 2);

  if (petCount >= 27 && !heartRainUnlocked) {
    heartRainUnlocked = true;
    showPetMessage("27 carinhos... chuva de amor");
    playSpecialMeow();
    triggerHeartRain();

    window.setTimeout(() => {
      heartRainUnlocked = false;
      petCount = 0;
      updatePetCountLabel();
    }, 4200);
  }
});

kissCat.addEventListener("ended", () => {
  kissCat.classList.remove("is-visible");
});

kissCat.addEventListener("transitionend", (event) => {
  if (event.propertyName === "opacity" && !kissCat.classList.contains("is-visible")) {
    kissCat.pause();
    kissCat.hidden = true;
  }
});

paintSlider(volumeSlider, 65, "#ffffff", "#5e5e5e");
updateTimelineProgress();
updateClock();
applyMood(currentTrackIndex);
placeDuck(lastPointerPosition.x, lastPointerPosition.y, 0);
placeDuckCursor(lastPointerPosition.x, lastPointerPosition.y);
updatePetCountLabel();
window.setInterval(updateClock, 1000);
