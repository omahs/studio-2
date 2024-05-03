<template>
  <v-navigation-drawer :border="0" location="right" class="player-queue" rounded="xl" :model-value="showQueue">
    <v-card flat>
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
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
const { track, showQueue, toggleQueue } = usePlayer()
</script>