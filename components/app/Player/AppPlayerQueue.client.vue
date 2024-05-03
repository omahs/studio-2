<template>
  <v-card class="player-queue" v-if="showQueue" rounded="xl">
    <v-card flat rounded>
      <v-card-title class="d-flex justify-space-between align-center pr-0">
        Queue
        <v-btn icon="mdi-close" variant="text" color="white" @click="toggleQueue" />
      </v-card-title>
    </v-card>

    <v-card v-if="track" flat>
      <v-card-title class="d-flex justify-space-between align-center pr-0 text-subtitle-1">
        Stai ascoltando
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="auto">
            <NuxtImg :src="track?.cover" height="56" width="56" />
          </v-col>
          <v-col class="pl-3">
            <div class="text-subtitle-1">{{ track.title }}</div>
            <div class="text-surface-variant">{{ track.artist }}</div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-card>
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