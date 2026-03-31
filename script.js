const audio = document.getElementById("profile-audio");
const toggleButton = document.getElementById("toggle-audio");
const playerStatus = document.getElementById("player-status");
const volumeSlider = document.getElementById("volume-slider");
const timelineSlider = document.getElementById("timeline-slider");
const currentTimeLabel = document.getElementById("current-time");
const totalTimeLabel = document.getElementById("total-time");

audio.volume = 0.65;

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
  } catch (error) {
    toggleButton.textContent = "Tocar musica";
    playerStatus.textContent = "O navegador bloqueou o autoplay. Clique no botao para tocar.";
  }
}

toggleButton.addEventListener("click", async () => {
  if (audio.paused) {
    await startAudio();
    return;
  }

  audio.pause();
  toggleButton.textContent = "Tocar musica";
  playerStatus.textContent = "Musica pausada.";
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
audio.addEventListener("ended", updateTimelineProgress);

audio.addEventListener("error", () => {
  toggleButton.textContent = "Arquivo ausente";
  toggleButton.disabled = true;
  volumeSlider.disabled = true;
  timelineSlider.disabled = true;
  playerStatus.textContent = "Verifique se a musica ainda esta na pasta media para ativar o player.";
});

paintSlider(volumeSlider, 65, "#ffffff", "#5e5e5e");
updateTimelineProgress();
startAudio();
