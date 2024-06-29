<template>
  <app-page>
    <template #title>
      Radio
    </template>
    <template #body>
      <v-btn v-for="radio in radios" :key="radio.id" @click="play(radio.id)">{{ radio.title }}</v-btn>
    </template>
  </app-page>
</template>

<script lang="ts" setup>
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

const radios: PlayerTrack[] = [{
  id: "radio-rds",
  title: "RDS - Radio Dimensione Suono",
  artist: "Rome, Italy",
  cover: "https://ipfs-1.bitsong.network/ipfs/QmXRgxmM8cLpZKJF4mgVPePgCBK1QCAnyfLg32jwqaJxm1",
  sources: {
    audio: "https://icstream.rds.radio/rds"
  }
}, {
  id: "radio-ibiza",
  title: "Radio Ibiza",
  artist: "Radio Ibiza",
  cover: "https://ipfs-1.bitsong.network/ipfs/QmbLBZ3i2hoXjArVyPxny145fh5LD33hbC8gJfB3UVn4yg",
  sources: {
    audio: "https://ice02.fluidstream.net/ibiza.aac"
  }
}, {
  id: "radio-freccia",
  title: "Radio Freccia",
  artist: "Radio Freccia",
  cover: "https://ipfs-1.bitsong.network/ipfs/QmeuWhWd5EyPbjabCF5kF1yg2kSLRwywTqwePhR5hM8oTw",
  sources: {
    audio: "https://dd782ed59e2a4e86aabf6fc508674b59.msvdn.net/live/S3160845/D6MENOraq6Qy/playlist_audio.m3u8"
  }
}, {
  id: 'radio-m2o',
  title: 'Radio M2O',
  artist: 'Rome, Italy',
  cover: 'https://ipfs-1.bitsong.network/ipfs/QmbKQYBtgXgRm18MWZBA37XWLSz7yuozzZZzHFFVMmCue1',
  sources: {
    audio: "https://4c4b867c89244861ac216426883d1ad0.msvdn.net/radiom2o/radiom2o/master_ma.m3u8"
  }
}, {
  id: 'radio-subasio',
  title: 'Radio Subasio',
  artist: 'Rome, Italy',
  cover: 'https://ipfs-1.bitsong.network/ipfs/QmNkmywWitbAwogeNSFPWyNFBHNr85JavmDoiRtYy11Cyk',
  sources: {
    audio: "https://icy.unitedradio.it/Subasio.mp3"
  }
}, {
  id: 'radio-monte-carlo',
  title: 'Radio Monte Carlo',
  artist: '105.5 FM',
  cover: 'https://play-lh.googleusercontent.com/9XxJ7JX-1zJWGRn9B8H7R7c9Z2UiWe2eBhHKahS7Z7RGFLwMOygIIQly_ieBIwL83g',
  sources: {
    audio: "https://icy.unitedradio.it/RMC.aac"
  }
}]

const { playRadio } = usePlayer()

function play(id: string) {
  const radio = radios.find(r => r.id == id)
  playRadio(radio)
}
</script>