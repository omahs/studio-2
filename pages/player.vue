<template>
  <AppPage>
    <template #body>
      <v-btn v-if="!isPlaying" @click="onPlay">Play</v-btn>
      <v-btn v-else @click="pause">Pause</v-btn>
    </template>
  </AppPage>
</template>

<script lang="ts" setup>
const { isPlaying, play, pause } = usePlayer()

async function onPlay() {
  const ids = getAllTracks().map((track) => track.nftAddress).join(',')
  await play(ids)
}
</script>