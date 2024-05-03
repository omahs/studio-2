<template>
  <v-responsive class="player-queue" v-if="showQueue" rounded="xl">

    <v-card v-if="track" flat class="pa-4 pt-6">
      <v-row class="d-flex" align="center" justify="space-around" no-gutters>
        <v-col cols="auto">
          <NuxtImg :src="track.cover" width="287" fit="cover" class="rounded-xl" />
        </v-col>
      </v-row>
      <v-row class="d-flex mt-0" align="center">
        <v-col cols="auto">
          <div class="text-h5">{{ track.title }}</div>
          <div class="text-surface-variant text-h6">{{ track.artist }}</div>
        </v-col>
      </v-row>
    </v-card>

    <v-card v-if="track" flat>
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
    </v-card>
  </v-responsive>
</template>

<script lang="ts" setup>
const { track, showQueue, toggleQueue } = usePlayer()
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