<template>

  <v-card flat title="Listening to..." append-icon="mdi-close" class="player-queue rounded-xl">
    <v-row class="d-flex" align="center" justify="space-around" no-gutters>
      <v-col cols="auto">
        <NuxtImg v-show="output === 'audio'" :src="track?.cover" width="287" fit="cover" class="rounded-xl" />
        <!--<video ref="audioEl" controls preload="auto" playsinline width="287" rounded-xl />-->
        <div v-show="output === 'video'" ref="playerVideo" class="rounded-xl" />
      </v-col>
    </v-row>

    <v-card-text>
      <div class="text-h5">{{ track?.title }}</div>
      <div class="text-surface-variant text-h6">{{ track?.artist }}</div>
      <v-btn size="small" class="mt-2" color="white" :prepend-icon="output === 'video' ? 'mdi-music' : 'mdi-video'"
        @click="toggleOutput">Switch to {{ output === 'video' ? 'audio' : 'video' }}</v-btn>
    </v-card-text>
  </v-card>


  <!--<v-card v-if="track" flat>
      <v-card-title class="d-flex justify-space-between align-center pr-0 text-body-1 text-surface-variant">
        Prossimi brani
      </v-card-title>
      <v-card-text>
        <v-responsive :max-height="300" style="overflow-y: auto;">
          <v-row v-for="i in 20" no-gutters class="mb-2">
            <v-col cols="auto">
              <NuxtImg :src="track?.cover" width="56" fit="cover" class="rounded-md" />
            </v-col>
            <v-col class="pl-3">
              <div class="text-subtitle-1">{{ track.title }}</div>
              <div class="text-surface-variant">{{ track.artist }}</div>
            </v-col>
          </v-row>
        </v-responsive>
      </v-card-text>
    </v-card>-->

</template>

<script lang="ts" setup>
const { track, showQueue, toggleQueue, attachVideo, toggleOutput, output, setupVideo } = usePlayer()

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