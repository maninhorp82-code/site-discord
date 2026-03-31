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
const kissCat = document.getElementById("kiss-cat");
const miniEq = document.getElementById("mini-eq");
const trackName = document.getElementById("track-name");
const coverImage = document.getElementById("cover-image");
const clockTime = document.getElementById("clock-time");
const clockTagline = document.getElementById("clock-tagline");

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

audio.volume = 0.65;
kissCat.muted = true;
kissCat.loop = false;
kissCat.hidden = true;

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
  introScreen.classList.add("is-leaving");
  document.body.classList.add("intro-finished");
  document.body.classList.add("cat-jumpscare");
  kissCat.hidden = false;
  kissCat.currentTime = 0;
  kissCat.classList.add("is-visible");
  kissCat.play().catch(() => {});
  await startAudio();

  window.setTimeout(() => {
    introScreen.hidden = true;
  }, 700);

  window.setTimeout(() => {
    document.body.classList.remove("cat-jumpscare");
  }, 420);
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
window.setInterval(updateClock, 1000);
