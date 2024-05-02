<template>
  <ClientOnly>
    <UploadTrack @done="onUploadTrackDone" />
  </ClientOnly>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'app-bar-only',
  middleware: ["upload"]
})

function onUploadTrackDone(trackId: string) {
  navigateTo(`/me/tracks/${trackId}/edit`)
}
</script>