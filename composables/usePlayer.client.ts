interface PlayerTrack {
  id: string;
  title: string;
  artist: string;
  cover: string;
  sources: {
    audio: string;
    video?: string;
  }
}

export const usePlayer = () => {
  const audioEl = useState<HTMLAudioElement | null>("audioEl", () => null);
  const videoEl = useState<HTMLVideoElement | null>("videoEl", () => null);

  const output = useState<"audio" | "video">("output", () => "video");

  const isReady = useState<boolean>("isReady", () => false);
  const isPlaying = useState<boolean>("isPlaying", () => false);
  const isBuffering = useState<boolean>("buffering", () => false);

  const queue = useState<PlayerTrack[]>("queue", () => []);
  const track = useState<PlayerTrack | null>("track", () => null);

  const progress = useState<number>("progress", () => 0);
  const buffer = useState<number>("buffer", () => 0);

  const currentTime = useState<number>("currentTime", () => 0);

  const showQueue = useState<boolean>("showQueue", () => true);

  function setupAudio() {
    audioEl.value = new Audio();

    _addElementListeners(audioEl.value);
    _addMediaSessionActionHandler();

    isReady.value = true;

    if (track.value?.id) {
      _play(track.value);
    }
  }

  function setupVideo(target: Ref<HTMLElement | undefined>) {
    console.log('setting up video')

    if (!target.value) {
      console.log("Target element is not available");
      return;
    }

    videoEl.value = document.createElement("video");
    target.value.append(videoEl.value);

    console.log(`video element created`)

    _addElementListeners(videoEl.value);
    _addMediaSessionActionHandler();

    isReady.value = true;


    if (track.value?.id) {
      _play(track.value);
    }
  }

  function attachVideo(targetId: string) {
    if (!videoEl.value) {
      return;
    }

    const target = document.getElementById(targetId);
    if (!target) {
      return;
    }

    console.log('target', target)

    target.append(videoEl.value);
  }

  function toggleOutput() {
    output.value = output.value === "audio" ? "video" : "audio";

    if (!track.value) {
      return;
    }

    if (output.value === "audio") {
      if (videoEl.value) {
        console.log('pausing video')
        videoEl.value.pause();
      }

      console.log('playing audio')
      _play(track.value);
    } else {
      if (audioEl.value) {
        console.log('pausing audio')
        audioEl.value.pause();
      }

      console.log('playing video')

      _play(track.value);
    }
  }

  function _addElementListeners(target: HTMLAudioElement | HTMLVideoElement) {
    target.addEventListener("timeupdate", onProgress);

    target.addEventListener("canplay", () => {
      console.log(`${output.value} is ready`);
    })

    target.addEventListener("error", () => {
      console.error(`Failed to play ${output.value}`)
    })

    target.addEventListener("loadeddata", () => {
      console.log(`loaded data - ${output.value}`)

      if (progress.value > 0) {
        target.currentTime = (progress.value * target.duration) / 100;
      }
    })

    target.addEventListener("ended", onEnded);
  }

  function _addMediaSessionActionHandler() {
    navigator.mediaSession.setActionHandler("play", onPlayback);
    navigator.mediaSession.setActionHandler("pause", onPlayback);
    navigator.mediaSession.setActionHandler("previoustrack", prev);
    navigator.mediaSession.setActionHandler("nexttrack", next);
    navigator.mediaSession.setActionHandler("seekto", seekTo)
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

    _setNavigatorMetadata(track.value);

    _play(track.value)
  }

  async function _play(track: PlayerTrack, options: { autoplay: boolean } = { autoplay: true }) {
    const el: HTMLAudioElement | HTMLVideoElement | null = output.value === "audio" ? audioEl.value : videoEl.value;

    if (!el) {
      throw new Error(`${output.value} element is not ready`);
    }

    console.log(`Playing ${output.value}`)

    el.crossOrigin = "anonymous";
    el.autoplay = options.autoplay;

    if (output.value === "audio") {
      el.src = track.sources.audio;
    } else {
      if (!track.sources.video) {
        throw new Error("Video source is not available");
      }

      el.src = track.sources.video;
      el.className = "rounded-xl"

      if (el instanceof HTMLVideoElement) {
        el.width = 287
        el.playsInline = true;
      }
    }

    console.log('autoplay', options.autoplay)

    if (options.autoplay) {
      await el.play();
      isPlaying.value = true;
    }

    seekTo(0);
  }

  function _setNavigatorMetadata(track: PlayerTrack) {
    navigator.mediaSession.setPositionState(undefined)
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: track.title,
      artwork: [{ src: track.cover, sizes: "512x512", type: "image/png" }],
    });
  }

  function pause() {
    const el = output.value === "audio" ? audioEl.value : videoEl.value;
    if (!el) {
      return;
    }

    el.pause();

    isPlaying.value = false;
  }

  function togglePlay() {
    const el = output.value === "audio" ? audioEl.value : videoEl.value;
    if (!el) {
      return;
    }

    if (isPlaying.value) {
      pause();
    } else {
      el.play();
      isPlaying.value = true;
    }
  }

  function next() {
    console.log('next')

    const index = trackIndex.value + 1;
    console.log('index', index)
    console.log('queue', queue.value.length)

    if (index <= queue.value.length) {
      console.log('playing next')
      console.log('track', queue.value[index - 1])
      play(queue.value[index - 1]);
    }
  }

  function prev() {
    const index = trackIndex.value - 1;
    console.log(`Track index: ${trackIndex.value}`)
    console.log(`Index: ${index}`)
    if (index >= 0) {
      console.log('playing prev')
      play(queue.value[index - 1]);
    }
  }

  function seekTo(value: number | MediaSessionActionDetails) {
    const el = output.value === "audio" ? audioEl.value : videoEl.value;

    if (!el) {
      return;
    }

    if (typeof value === "number") {
      if (isNaN(el.duration)) {
        el.currentTime = 0;
      } else {
        el.currentTime = value * el.duration / 100;
      }
    } else {
      if (value.seekTime) {
        el.currentTime = value.seekTime;
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
    const el = output.value === "audio" ? audioEl.value : videoEl.value;

    if (!el) {
      return;
    }

    isBuffering.value = el.buffered.length === 0 || el.readyState < 4

    if (el.duration > 0) {
      let bufferEnd = 0;
      for (let i = 0; i < el.buffered.length; i++) {
        if (el.buffered.start(i) <= el.currentTime) {
          bufferEnd = Math.max(bufferEnd, el.buffered.end(i));
        }
      }
      buffer.value = (bufferEnd / el.duration) * 100;
    }

    const _progress = (el.currentTime / el.duration) * 100;
    if (!isNaN(_progress)) {
      progress.value = _progress;

      currentTime.value = el.currentTime;

      if ("mediaSession" in navigator) {
        navigator.mediaSession.setPositionState({
          duration: el.duration,
          playbackRate: el.playbackRate,
          position: el.currentTime,
        });
      }
    }
  }

  function onEnded() {
    const el = output.value === "audio" ? audioEl.value : videoEl.value;
    if (!el) {
      return;
    }

    el.currentTime = 0;
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

    audioEl.value?.pause();
    audioEl.value?.remove();

    navigator.mediaSession.setActionHandler("play", null);
    navigator.mediaSession.setActionHandler("pause", null);
    navigator.mediaSession.setActionHandler("previoustrack", null);
    navigator.mediaSession.setActionHandler("nexttrack", null);
    navigator.mediaSession.setActionHandler("seekto", null)
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
    output,
    play,
    pause,
    togglePlay,
    next,
    prev,
    seekTo,
    toggleQueue,
    attachVideo,
    toggleOutput,
    setupVideo,
    queue
  }
}