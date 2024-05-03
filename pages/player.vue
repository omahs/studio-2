<template>
  <AppPage>
    <template #body>
      ciao, {{ time }}

      <v-btn v-if="!isPlaying" @click="onPlay">Play</v-btn>
      <v-btn v-else @click="pause">Pause</v-btn>
    </template>
  </AppPage>
</template>

<script lang="ts" setup>
const { isPlaying, play, pause, time } = usePlayer()

function onPlay() {
  play({
    id: '1',
    title: 'Ready or Not',
    artist: 'Adam Clay',
    cover: 'https://media-api.bitsong.studio/ipfs/QmWF5LpGkH67fqv89cTrB36UAcxo2ZtbY9VSMv7wKKaAoQ',
    source: 'https://media-api.bitsong.studio/ipfs/QmVHeigK8JawpBsqEeGLpCgnq31ScDpZTWMy2euu1Sbsuh',
  })
}
</script>