let audioUnlocked = false;

export async function unlockAudio() {
  if (audioUnlocked) return;

  const audio = new Audio("/audio/noti-sound.m4a");

  try {
    await audio.play();
    audio.pause();
    audio.currentTime = 0;

    audioUnlocked = true;
  } catch {}
}
