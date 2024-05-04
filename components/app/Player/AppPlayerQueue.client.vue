<template>
  <v-responsive class="player-queue" v-show="showQueue && track">

    <v-card flat title="Listening to..." append-icon="mdi-close" class="rounded-xl">
      <template #append>
        <v-btn icon="mdi-close" color="white" variant="text" @click="toggleQueue" />
      </template>
      <v-row class="d-flex" align="center" justify="space-around" no-gutters>
        <v-col cols="auto">
          <NuxtImg v-show="output === 'audio'" :src="track?.cover" width="287" fit="cover" class="rounded-xl" />
          <!--<video ref="audioEl" controls preload="auto" playsinline width="287" rounded-xl />-->
          <div v-show="output === 'video'" ref="playerVideo" class="rounded-xl" />
        </v-col>
      </v-row>

      <v-card-text>
        <div class="text-h5"
          :style="{ maxWidth: '300px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }">{{
    track?.title
  }}</div>
        <div class="text-surface-variant text-h6"
          :style="{ maxWidth: '300px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }">{{
    track?.artist
  }}</div>
        <v-btn size="small" class="mt-2" color="white" :prepend-icon="output === 'video' ? 'mdi-music' : 'mdi-video'"
          @click="toggleOutput">Switch to {{ output === 'video' ? 'audio' : 'video' }}</v-btn>
      </v-card-text>
    </v-card>
    <v-card v-if="queue.length" flat>
      <v-card-title class="d-flex justify-space-between align-center pr-0 text-body-1 text-surface-variant">
        Prossimi brani
      </v-card-title>
      <v-card-text>
        <v-responsive :max-height="300" style="overflow-y: auto;">
          <v-row v-for="track in queue" :key="track.id" no-gutters class="mb-2">
            <v-col cols="auto">
              <NuxtImg :src="track?.cover" width="56" fit="cover" class="rounded-md" />
            </v-col>
            <v-col class="pl-3">
              <div class="text-subtitle-1"
                :style="{ maxWidth: '180px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }">{{
    track.title }}</div>
              <div class="text-surface-variant">{{ track.artist }}</div>
            </v-col>
          </v-row>
        </v-responsive>
      </v-card-text>
    </v-card>

  </v-responsive>

</template>

<script lang="ts" setup>
import type { text } from '@fortawesome/fontawesome-svg-core';

const { track, showQueue, toggleQueue, attachVideo, toggleOutput, output, setupVideo, queue } = usePlayer()

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
  background-color: #272727;
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
</style>