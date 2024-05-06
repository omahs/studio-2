<template>
  <v-responsive class="player-queue" v-show="showQueue && track">

    <v-card flat title="Now playing" class="rounded-xl pb-2">
      <template #append>
        <v-btn icon="mdi-close" color="white" variant="text" @click="toggleQueue" />
      </template>

      <v-row class="d-flex" align="center" justify="space-around" no-gutters>
        <v-col cols="auto">
          <NuxtImg v-show="output === 'audio' || forceAudioOutput" :src="track?.cover" width="287" fit="cover"
            class="rounded-xl" />
          <div v-show="output === 'video' && !forceAudioOutput" ref="playerVideo" class="rounded-xl"
            :style="{ width: '287px', height: '287px' }" />
        </v-col>
      </v-row>

      <v-card-text class="pt-1">
        <div class="text-h6 player-queue__title-info">{{ track?.title }}</div>
        <div class="text-surface-variant text-body-1 player-queue__title-info">{{ track?.artist }}</div>
      </v-card-text>

      <v-row no-gutters class="px-4" align="center" justify="space-between">
        <v-col :style="{ width: '240px' }" cols="auto">
          <v-slider v-model="progress" hide-details @update:model-value="seekTo" />
        </v-col>
        <v-col cols="auto">
          <span class="text-surface-variant text-subtitle-2">{{ time }}</span>
        </v-col>
      </v-row>

      <v-row no-gutters justify="space-between" align="center" class="px-2">
        <v-col cols="auto">
          <v-btn :disabled="!hasPrev || isLoading" color="white" icon="mdi-skip-previous" class="text-h6 mt-1 mx-1"
            variant="text" @click="prev" />
          <v-btn v-if="!isPlaying && !isLoading" color="white" icon="mdi-play" variant="text" class="text-h4 mx-2"
            @click="togglePlay" />
          <v-btn v-else-if="isPlaying && !isLoading" variant="text" color="white" icon="mdi-pause" class="text-h4 mx-2"
            @click="togglePlay" />
          <v-progress-circular v-if="isLoading" class="mx-2" size="48" color="primary"
            indeterminate></v-progress-circular>
          <v-btn :disabled="!hasNext || isLoading" color="white" icon="mdi-skip-next" class="text-h6 mt-1 mx-1"
            variant="text" @click="next" />
        </v-col>
        <v-col cols="auto">
          <v-tooltip :text="`Switch to ${output === 'video' ? 'audio' : 'video'}`" location="top">
            <template v-slot:activator="{ props }">
              <v-btn :disabled="disableToggleOutput" v-bind="props" color="white" size="small" class="mt-1"
                :icon="output === 'video' ? 'mdi-television' : 'mdi-music'" variant="tonal" @click="toggleOutput" />
            </template>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-card>

    <v-card v-if="nextTracks.length" flat>
      <v-card-title class="d-flex justify-space-between align-center pr-0 text-body-1 text-surface-variant">
        Next tracks
      </v-card-title>
      <v-card-text>
        <v-responsive :max-height="300" style="overflow-y: auto;">
          <v-list density="compact">
            <v-list-item v-for="track in nextTracks" :key="track.id" class="px-0" @click="play(track.id)">
              <template #prepend>
                <NuxtImg :src="track?.cover" width="56" fit="cover" class="rounded-md mr-2" />
              </template>
              <template #title>
                {{ track?.title }}
              </template>
              <template #subtitle>
                {{ track?.artist }}
              </template>
            </v-list-item>
          </v-list>
        </v-responsive>
      </v-card-text>
    </v-card>

  </v-responsive>

</template>

<script lang="ts" setup>
const {
  track,
  showQueue,
  toggleQueue,
  toggleOutput,
  output,
  setupVideo,
  progress,
  seekTo,
  isPlaying,
  hasPrev,
  hasNext,
  next,
  prev,
  togglePlay,
  time,
  play,
  nextTracks,
  isLoading,
  disableToggleOutput,
  forceAudioOutput
} = usePlayer()

const playerVideo = ref<HTMLElement>()

onMounted(async () => {
  await nextTick()
  setupVideo(playerVideo)
})
</script>

<style>
.player-queue {
  position: fixed;
  bottom: 0;
  right: 0;
  background-color: #212121;
  color: #fff;
  height: 100%;
  width: 330px;
  z-index: 2000;
  overflow-y: auto;
}

.v-main--player-queue {
  --v-layout-right: 305px !important;
}

.v-toolbar--player-queue {
  right: 300px !important;
  width: calc(100% - 586px) !important;
}

.player-queue__title-info {
  max-width: 300px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>