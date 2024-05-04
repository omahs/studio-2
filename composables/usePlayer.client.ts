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

  const showQueue = useState<boolean>("showQueue", () => false);

  function setupAudio() {
    audioEl.value = new Audio();

    _addElementListeners(audioEl.value);
    _addMediaSessionActionHandler();

    isReady.value = true;

    if (track.value?.id && output.value === "audio") {
      _playAudio(track.value, {
        autoplay: false
      });
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


    if (track.value?.id && output.value === "video") {
      _playVideo(track.value, {
        autoplay: false
      });
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
      _playAudio(track.value, {
        autoplay: isPlaying.value
      });
    } else {
      if (audioEl.value) {
        console.log('pausing audio')
        audioEl.value.pause();
      }

      console.log('playing video')

      _playVideo(track.value, {
        autoplay: isPlaying.value
      });
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

    if (output.value === "audio") {
      _playAudio(track.value)
    } else {
      _playVideo(track.value)
    }
  }

  async function _playAudio(track: PlayerTrack, options: { autoplay: boolean } = { autoplay: true }) {
    if (!audioEl.value) {
      throw new Error("Audio element is not ready");
    }

    console.log(`Playing audio - ${track.sources.audio}`)

    audioEl.value.src = track.sources.audio;
    audioEl.value.crossOrigin = "anonymous";

    if (options.autoplay) {
      await audioEl.value.play();
      isPlaying.value = true;
    }
  }

  async function _playVideo(track: PlayerTrack, options: { autoplay: boolean } = { autoplay: true }) {
    if (!videoEl.value) {
      console.log(videoEl.value)
      throw new Error("Video element is not ready");
    }

    if (!track.sources.video) {
      throw new Error("Video source is not available");
    }

    console.log(`Playing video - ${track.sources.video}`)

    videoEl.value.src = track.sources.video;
    videoEl.value.crossOrigin = "anonymous";
    videoEl.value.width = 287
    videoEl.value.className = "rounded-xl"

    if (options.autoplay) {
      await videoEl.value.play();
      isPlaying.value = true;
    }
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
    if (output.value === "audio") {
      audioEl.value?.pause();
    } else {
      videoEl.value?.pause();
    }

    isPlaying.value = false;
  }

  function togglePlay() {
    if (isPlaying.value) {
      pause();
    } else {
      if (output.value === "audio") {
        audioEl.value?.play();
      } else {
        videoEl.value?.play();
      }
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
    const el = output.value === "audio" ? audioEl.value : videoEl.value;

    if (!el) {
      return;
    }

    if (typeof value === "number") {
      el.currentTime = value * el.duration / 100;
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
    setupVideo
  }
}