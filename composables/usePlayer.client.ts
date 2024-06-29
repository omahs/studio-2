import Hls from 'hls.js';

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

  const hls = useState<Hls | null>("hls", () => null);

  const output = useState<"audio" | "video">("output", () => "audio");

  const forceAudioOutput = useState<boolean>("forceAudioOutput", () => false);

  const isReady = useState<boolean>("isReady", () => false);
  const isPlaying = useState<boolean>("isPlaying", () => false);
  const isLoading = useState<boolean>("isLoading", () => false);
  const isBuffering = useState<boolean>("buffering", () => false);

  const queue = useState<PlayerTrack[]>("queue", () => []);
  const track = useState<PlayerTrack | null>("track", () => null);

  const progress = useState<number>("progress", () => 0);
  const buffer = useState<number>("buffer", () => 0);

  const currentTime = useState<number>("currentTime", () => 0);

  const showQueue = useState<boolean>("showQueue", () => true);

  const playTime = useState<number>("playTime", () => 0);
  const previousTime = useState<number>("previousTime", () => 0);
  const seekedTime = useState<number>("seekedTime", () => 0);
  const lastCheckpointTime = useState<number>("lastCheckpointTime", () => 0);

  function _resetPlayCounters() {
    playTime.value = 0;
    previousTime.value = 0;
    seekedTime.value = 0;
  }

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
    if (!track.value) {
      return;
    }

    if (!track.value.sources.video) {
      return;
    }

    output.value = output.value === "audio" ? "video" : "audio";

    if (output.value === "audio") {
      if (videoEl.value) {
        console.log('pausing video')
        videoEl.value.pause();
      }

      console.log('playing audio')
      _play(track.value, { autoplay: isPlaying.value, continue: true });
    } else {
      if (audioEl.value) {
        console.log('pausing audio')
        audioEl.value.pause();
      }

      console.log('playing video')

      _play(track.value, { autoplay: isPlaying.value, continue: true });
    }
  }

  function _addElementListeners(target: HTMLAudioElement | HTMLVideoElement) {
    target.addEventListener("timeupdate", onProgress);

    target.addEventListener("canplay", () => {
      isLoading.value = false;
      console.log(`${output.value} can play`);
    })

    target.addEventListener("error", () => {
      console.error(`Failed to play ${output.value}`)
    })

    target.addEventListener("loadeddata", () => {
      console.log(`loaded data - ${output.value}`)

      if (progress.value > 0) {
        target.currentTime = (progress.value * target.duration) / 100;
      }

      isLoading.value = false;
    })

    target.addEventListener("loadstart", () => {
      isLoading.value = true;
      console.log(`load start - ${output.value}`)
    })

    target.addEventListener("waiting", () => {
      isLoading.value = true;
      console.log(`waiting - ${output.value}`)
    })

    target.addEventListener("stalled", () => {
      console.log(`stalled - ${output.value}`)
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

  async function _fetchTracksInfo(nfts: string[]) {
    const { mediaApi } = useRuntimeConfig().public
    const tracks = await $fetch<PlayerTrack[]>(`${mediaApi}/nfts/stream-info?ids=${nfts.join(",")}`);
    if (!tracks.length) {
      throw new Error("Failed to fetch tracks info");
    }

    return tracks.map((track) => ({
      ...track,
      cover: useIpfsLink(track.cover),
      sources: {
        audio: useIpfsLink(track.sources.audio),
        video: track.sources.video ? useIpfsLink(track.sources.video) : undefined
      }
    }));
  }

  async function _fetchTracksInfoPrivate(ids: string[]) {
    const { mediaApiDirect, mediaApi } = useRuntimeConfig().public
    const tracks = await $fetch<PlayerTrack[]>(`${mediaApiDirect}/me/private-uploads/stream-info?ids=${ids.join(",")}`, {
      headers: {
        'Authorization': `Bearer ${useUserState().value?.sid}`
      },
    });
    if (!tracks.length) {
      throw new Error("Failed to fetch tracks info");
    }

    return tracks.map((track) => ({
      ...track,
      cover: track.cover,
      sources: {
        audio: `${mediaApi}/ipfs/${track.sources.audio}`,
      }
    }));
  }

  //function play(...tracks: PlayerTrack[]) {
  async function play(...nfts: string[]) {
    let tracks: PlayerTrack[] = [];

    const bitsongTracks = nfts.filter((nft) => nft.startsWith("bitsong1"));
    const privateTracks = nfts.filter((nft) => nft.startsWith("private:"));

    if (bitsongTracks.length) {
      tracks = await _fetchTracksInfo(bitsongTracks);
    }

    if (privateTracks.length) {
      tracks = tracks.concat(await _fetchTracksInfoPrivate(privateTracks));
    }

    addTracks(tracks);

    track.value = tracks[0];

    // TODO: move this to a separate function
    isPlaying.value = true;

    _setNavigatorMetadata(track.value);

    _play(track.value)

    if (queue.value.length === 1) {
      if (nfts[0].startsWith("bitsong1")) {
        const moreTracks = getAllTracks().map((track) => track.nftAddress).filter((nft) => !nfts.includes(nft));
        addTracks(await _fetchTracksInfo(moreTracks));
      } else if (nfts[0].startsWith("private:")) {
        const moreTracks = await $fetch<PlayerTrack[]>(`/media-api/me/private-uploads/more?id=${nfts[0]}`, {
          headers: {
            'Authorization': `Bearer ${useUserState().value?.sid}`
          },
        })
        addTracks(moreTracks.map((track) => ({
          ...track,
          cover: track.cover,
          sources: {
            audio: `/media-api/me/private-uploads/media/${track.sources.audio}`,
          }
        })));
      }
    }
  }

  async function playRadio(track: PlayerTrack) {
    _play(track);
  }

  async function _play(_track: PlayerTrack, options: { autoplay: boolean, continue: boolean } = { autoplay: true, continue: false }) {
    track.value = _track;

    console.log('has video?', !!track.value.sources.video)

    if (track.value.sources.video) {
      forceAudioOutput.value = false;
    } else {
      forceAudioOutput.value = true;
    }

    console.log('force audio output', forceAudioOutput.value)

    const el = _getEl();

    if (track.value.sources.audio.endsWith(".m3u8")) {
      hls.value = new Hls();
      hls.value.loadSource(track.value.sources.audio);
      hls.value.attachMedia(el);

      hls.value.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('manifest parsed')
        el.play();
      })

      return
    }

    //console.log(`Playing ${output.value}`)

    el.crossOrigin = "anonymous";
    el.autoplay = options.autoplay;

    if (output.value === "audio" || (output.value === "video" && forceAudioOutput.value)) {
      el.src = _track.sources.audio;

      if (output.value === "video" && forceAudioOutput.value) {
        videoEl.value?.pause();
      }
    } else {
      if (!_track.sources.video) {
        throw new Error("Video source is not available");
      }

      if (!forceAudioOutput.value) {
        audioEl.value?.pause();
      }

      el.src = _track.sources.video;
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

    if (!options.continue) {
      seekTo(0);
    }

    useAppEvent('player-play', { track: _track.id, autoplay: options.autoplay, continue: options.continue });
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
    const el = _getEl();
    el.pause();
    isPlaying.value = false;

    useAppEvent('player-pause', { track: track.value?.id });
  }

  function _getEl() {
    const el = output.value === "audio" || (output.value === "video" && forceAudioOutput.value) ? audioEl.value : videoEl.value;
    if (!el) {
      throw new Error(`${output.value} element is not ready`);
    }

    return el;
  }

  function togglePlay() {
    const el = _getEl()

    if (isPlaying.value) {
      pause();
    } else {
      el.play();
      isPlaying.value = true;
    }

    useAppEvent('player-toggle-play', { track: track.value?.id })
  }

  function next() {
    console.log('next')

    const index = trackIndex.value + 1;

    if (index <= queue.value.length) {
      isLoading.value = true;
      const nextIndex = index - 1;

      _play(queue.value[nextIndex]);
    } else {
      _play(queue.value[0]);
    }

    _resetPlayCounters()

    useAppEvent('player-next', { track: track.value?.id });
  }

  function prev() {
    console.log('prev')

    const index = trackIndex.value - 1;

    if (index >= 0) {
      isLoading.value = true;
      const prevIndex = index - 1;

      _play(queue.value[prevIndex]);
    }

    _resetPlayCounters()

    useAppEvent('player-prev', { track: track.value?.id });
  }

  function seekTo(value: number | MediaSessionActionDetails) {
    const el = _getEl();

    let targetTime;
    if (typeof value === "number") {
      targetTime = isNaN(el.duration) ? 0 : (value * el.duration / 100);
    } else {
      targetTime = value.seekTime || el.currentTime;
    }

    // Log seeked time
    const diff = Math.abs(el.currentTime - targetTime);
    seekedTime.value += diff;
    previousTime.value = targetTime;

    el.currentTime = targetTime;

    useAppEvent('player-seek-to', { track: track.value?.id, time: targetTime });
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

  async function _duration() {
    const el = _getEl();

    if (isNaN(el.duration)) {
      await new Promise((resolve) => {
        el.addEventListener("loadedmetadata", () => {
          resolve(null);
        })
      })
    }

    return el.duration;
  }

  const duration = computed(() => {
    return _duration().then((duration) => {
      return duration;
    })
  })

  const trackIndex = computed(() => {
    return Math.abs(queue.value.findIndex((t) => t.id === track.value?.id) + 1);
  })

  const hasPrev = computed(() => trackIndex.value > 1)

  const hasNext = computed(() => trackIndex.value < queue.value.length)

  const nextTracks = computed(() => {
    return queue.value.slice(trackIndex.value);
  })

  const disableToggleOutput = computed(() => {
    return !track.value || !track.value.sources.video;
  })

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
    const el = _getEl();

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

      const timeDiff = el.currentTime - previousTime.value;
      if (timeDiff >= 0 && timeDiff <= 1) { // Assume max step of 1 sec for normal playback
        playTime.value += timeDiff;
      }
      previousTime.value = el.currentTime;

      const _checkpointTime = 30; // 30 seconds
      const _playTimeRounded = Math.floor(playTime.value);

      // console.log(`Play time: ${_playTimeRounded} seconds`);

      if (_playTimeRounded % _checkpointTime === 0 && lastCheckpointTime.value < Date.now() - _checkpointTime * 1000) {
        lastCheckpointTime.value = Date.now();

        if (_playTimeRounded > 0) {
          // console.log(`Sending player-checkpoint event at ${playTime.value} seconds`);
          useAppEvent('player-checkpoint', { track: track.value?.id, time: _playTimeRounded });
        }
      }

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
    const el = _getEl();

    el.currentTime = 0;
    isPlaying.value = false;
    next();
  }

  // onMounted(() => {
  //   setupAudio();
  // })

  function onMount() {
    setupAudio();
  }

  // onUnmounted(() => {
  //   audioEl.value?.removeEventListener("timeupdate", onProgress);
  //   audioEl.value?.removeEventListener("canplay", () => {
  //     console.log("Audio is ready");
  //   })
  //   audioEl.value?.removeEventListener("error", () => {
  //     console.error("Failed to play audio");
  //   })
  //   audioEl.value?.removeEventListener("loadeddata", () => {
  //     console.log("loaded data");
  //   })
  //   audioEl.value?.removeEventListener("ended", onEnded);

  //   audioEl.value?.pause();
  //   audioEl.value?.remove();

  //   navigator.mediaSession.setActionHandler("play", null);
  //   navigator.mediaSession.setActionHandler("pause", null);
  //   navigator.mediaSession.setActionHandler("previoustrack", null);
  //   navigator.mediaSession.setActionHandler("nexttrack", null);
  //   navigator.mediaSession.setActionHandler("seekto", null)
  // })

  function onUnmount() {
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
  }

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
    playRadio,
    pause,
    togglePlay,
    next,
    prev,
    seekTo,
    toggleQueue,
    attachVideo,
    toggleOutput,
    setupVideo,
    queue,
    duration,
    onMount,
    onUnmount,
    nextTracks,
    isLoading,
    disableToggleOutput,
    forceAudioOutput
  }
}