interface PlayerTrack {
  id: string;
  title: string;
  artist: string;
  cover: string;
  source: string;
}

export const usePlayer = () => {
  const audioEl = ref<HTMLAudioElement | null>(null);

  const isReady = ref(false);
  const isPlaying = ref(false);

  const queue = useState<PlayerTrack[]>("queue", () => []);
  const track = useState<PlayerTrack | null>("track", () => null);

  function setupAudio() {
    audioEl.value = new Audio();

    audioEl.value.addEventListener("canplay", () => {
      console.log("Audio is ready");
    })

    audioEl.value.addEventListener("error", () => {
      console.error("Failed to play audio");
    })

    audioEl.value.addEventListener("loadeddata", () => {
      console.log("loaded data");

      // TODO: progressbar
    })

    if (track.value?.id) {
      setupAudioPlayer(track.value, {
        autoplay: false
      });
    }

    navigator.mediaSession.setActionHandler("play", onPlayback);
    navigator.mediaSession.setActionHandler("pause", onPlayback);
    // TODO: previoustrack, nexttrack, seekto
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

  onMounted(() => {
    setupAudio();
  })

  return {
    isReady,
    isPlaying,
    track,
    play,
    pause
  }
}