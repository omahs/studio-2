<template>
  <v-container fluid v-if="!showQueue && track && isReady" class="player d-flex flex-column pa-0">
    <v-slider v-model="progress" hide-details @update:model-value="seekTo" />
    <v-row no-gutters align="center" justify="space-between" class="px-4 py-0 my-0 info">
      <v-col cols="auto" @click="onPlayerClick" :style="{ width: '240px' }
    ">
        <v-row align="center" no-gutters>
          <v-col cols="auto">
            <NuxtImg :src="track?.cover || `/images/default.png`" class="rounded-lg" height="56" width="56" />
          </v-col>
          <v-col class="pl-3">
            <div class="player__title-info">{{ track.title }}</div>
            <div class="player__title-info text-surface-variant">{{ track.artist }}</div>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="auto">
        <v-btn v-if="!mobile" :disabled="!hasPrev" color="white" icon="mdi-skip-previous" class="text-h6 mt-1 mx-1"
          variant="text" @click="prev" />

        <v-btn v-if="!isPlaying" color="white" icon="mdi-play" variant="text" class="text-h4 mx-2"
          :class="{ 'mt-n3': mobile }" @click="togglePlay" />
        <v-btn v-else :class="{ 'mt-n3': mobile }" variant="text" color="white" icon="mdi-pause" class="text-h4 mx-2"
          @click="togglePlay" />

        <v-btn v-if="!mobile" :disabled="!hasNext" color="white" icon="mdi-skip-next"
          class="d-xs-none text-h6 mt-1 mx-1" variant="text" @click="next" />
      </v-col>

      <v-col v-if="!mobile" cols="auto" class="d-md-flex align-center">
        <v-btn icon="mdi-playlist-music" variant="text" :color="showQueue ? 'white' : 'surface-variant'"
          @click="toggleQueue" />
        <div class="d-none d-md-flex">
          <div class="text-surface-variant text-subtitle-2">{{ time }}</div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay()

const {
  isReady,
  isPlaying,
  track,
  time,
  progress,
  showQueue,
  togglePlay,
  seekTo,
  toggleQueue,
  hasNext,
  hasPrev,
  next,
  prev
} = usePlayer()

function onPlayerClick() {
  if (mobile.value) toggleQueue()
}
</script>

<style scoped>
.player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #272727;
  color: #fff;
  height: 84px;
  width: 100%;
  z-index: 2000;
}

.player .v-slider {
  margin-top: -16px;
  margin-left: 0;
  margin-right: 0;
  padding-left: 0;
  padding-right: 0;
}

.player .info {
  margin-top: -15px !important;
}

.player__title-info {
  max-width: 165px;
  white-space: nowrap;
  overflow: hidden;
}
</style>