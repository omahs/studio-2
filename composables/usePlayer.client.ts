interface PlayerTrack {
  id: string;
  title: string;
  artist: string;
  cover: string;
  source: string;
}

export const usePlayer = () => {
  const audioEl = useState<HTMLAudioElement | null>("audioEl", () => null);

  const isReady = useState<boolean>("isReady", () => false);
  const isPlaying = useState<boolean>("isPlaying", () => false);
  const isBuffering = useState<boolean>("buffering", () => false);

  const queue = useState<PlayerTrack[]>("queue", () => []);
  const track = useState<PlayerTrack | null>("track", () => null);

  const progress = useState<number>("progress", () => 0);
  const buffer = useState<number>("buffer", () => 0);

  const currentTime = useState<number>("currentTime", () => 0);

  const showQueue = useState<boolean>("showQueue", () => false);

  function setupAudio() {
    audioEl.value = new Audio();

    audioEl.value.addEventListener("timeupdate", onProgress);

    audioEl.value.addEventListener("canplay", () => {
      console.log("Audio is ready");
    })

    audioEl.value.addEventListener("error", () => {
      console.error("Failed to play audio");
    })

    audioEl.value.addEventListener("loadeddata", () => {
      console.log("loaded data");

      if (progress.value > 0) {
        audioEl.value!.currentTime = (progress.value * audioEl.value!.duration) / 100;
      }
    })

    audioEl.value.addEventListener("ended", onEnded);

    if (track.value?.id) {
      setupAudioPlayer(track.value, {
        autoplay: false
      });
    }

    navigator.mediaSession.setActionHandler("play", onPlayback);
    navigator.mediaSession.setActionHandler("pause", onPlayback);
    navigator.mediaSession.setActionHandler("previoustrack", prev);
    navigator.mediaSession.setActionHandler("nexttrack", next);
    navigator.mediaSession.setActionHandler("seekto", seekTo)

    isReady.value = true;
  }

  function addTracks(tracks: PlayerTrack[]) {
    queue.value = queue.value.concat(
      tracks.filter((track) => !queue.value.map((t) => t.id).includes(track.id))
    )
  }

  function play(...tracks: PlayerTrack[]) {
    addTracks(tracks);

    track.value = tracks[0];
    isPlaying.value = true;

    setupAudioPlayer(track.value);
  }

  function pause() {
    audioEl.value?.pause();
    isPlaying.value = false;
  }

  function togglePlay() {
    if (isPlaying.value) {
      pause();
    } else {
      audioEl.value?.play();
      isPlaying.value = true;
    }
  }

  function next() {
    const index = trackIndex.value + 1;
    if (index < queue.value.length) {
      play(queue.value[index]);
    }
  }

  function prev() {
    const index = trackIndex.value - 1;
    if (index >= 0) {
      play(queue.value[index]);
    }
  }

  function seekTo(value: number | MediaSessionActionDetails) {
    if (!audioEl.value) {
      return;
    }

    if (typeof value === "number") {
      audioEl.value.currentTime = value * audioEl.value.duration / 100;
    } else {
      if (value.seekTime) {
        audioEl.value.currentTime = value.seekTime;
      }
    }
  }

  function toggleQueue() {
    showQueue.value = !showQueue.value;
  }

  const time = computed(() => {
    const hours = Math.floor(currentTime.value / 3600);
    const minutes = Math.floor((currentTime.value % 3600) / 60);
    const seconds = Math.round(currentTime.value % 60);

    return `${hours > 0 ? hours + ":" : ""}${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  })

  const trackIndex = computed(() => {
    return Math.abs(queue.value.findIndex((t) => t.id === track.value?.id) + 1);
  })

  const hasPrev = computed(() => trackIndex.value > 1)

  const hasNext = computed(() => trackIndex.value < queue.value.length)

  async function setupAudioPlayer(track: PlayerTrack, options: { autoplay: boolean } = { autoplay: true }) {
    if (!audioEl.value) {
      throw new Error("Audio element is not ready");
    }

    audioEl.value.src = track.source;
    audioEl.value.crossOrigin = "anonymous";

    if (options.autoplay) {
      await audioEl.value.play();
      isPlaying.value = true;
    }

    navigator.mediaSession.setPositionState(undefined)
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: track.title,
      artwork: [{ src: track.cover, sizes: "512x512", type: "image/png" }],
    });
  }

  function onPlayback() {
    if (!audioEl.value?.paused) {
      audioEl.value?.pause();
      isPlaying.value = false;
    } else {
      audioEl.value?.play();
      isPlaying.value = true;
    }
  }

  function onProgress() {
    if (!audioEl.value) {
      return;
    }

    isBuffering.value = audioEl.value.buffered.length === 0;

    if (audioEl.value.duration > 0) {
      for (let i = 0; i < audioEl.value.buffered.length; i++) {
        if (audioEl.value.buffered.start(audioEl.value.buffered.length - 1 - i) < audioEl.value.currentTime) {
          buffer.value = audioEl.value.buffered.end(audioEl.value.buffered.length - 1 - i) / audioEl.value.duration * 100;
          break;
        }
      }
    }

    const _progress = (audioEl.value.currentTime / audioEl.value.duration) * 100;
    if (!isNaN(_progress)) {
      progress.value = _progress;

      currentTime.value = audioEl.value.currentTime;

      if ("mediaSession" in navigator) {
        navigator.mediaSession.setPositionState({
          duration: audioEl.value.duration,
          playbackRate: audioEl.value.playbackRate,
          position: audioEl.value.currentTime,
        });
      }
    }
  }

  function onEnded() {
    audioEl.value!.currentTime = 0;
    isPlaying.value = false;
    next();
  }

  onMounted(() => {
    setupAudio();
  })

  onUnmounted(() => {
    audioEl.value?.removeEventListener("timeupdate", onProgress);
    audioEl.value?.removeEventListener("canplay", () => {
      console.log("Audio is ready");
    })
    audioEl.value?.removeEventListener("error", () => {
      console.error("Failed to play audio");
    })
    audioEl.value?.removeEventListener("loadeddata", () => {
      console.log("loaded data");
    })
    audioEl.value?.removeEventListener("ended", onEnded);

    navigator.mediaSession.setActionHandler("play", null);
    navigator.mediaSession.setActionHandler("pause", null);
    navigator.mediaSession.setActionHandler("previoustrack", null);
    navigator.mediaSession.setActionHandler("nexttrack", null);
    navigator.mediaSession.setActionHandler("seekto", null)

    audioEl.value?.pause();
    audioEl.value?.remove();
  })

  return {
    isReady,
    isPlaying,
    track,
    progress,
    time,
    hasNext,
    hasPrev,
    showQueue,
    play,
    pause,
    togglePlay,
    next,
    prev,
    seekTo,
    toggleQueue,
  }
}