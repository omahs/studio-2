<template>
  <v-container class="mt-8">
    <v-row justify="center">
      <v-col cols="auto" class="text-center">
        <h1 class="text-h4 text-md-h3 font-weight-bold">Upload your track</h1>
        <h2 class="text-h6 pt-2 text-surface-variant">Choose the track you want to upload</h2>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-12">
      <v-col cols="12" lg="11" xl="7">
        <v-card :variant="isOverDropZone ? 'teal' : 'flat'" ref="dropZoneRef" :loading="loading" :disabled="loading"
          height="300" class="d-flex align-center justify-center flex-column"
          :style="{ border: '1px dashed rgb(139 139 139)' }" @click.stop="open">
          <v-icon size="64">mdi-music</v-icon>

          <v-card-title class="text-h5">Click or drag audio file</v-card-title>
          <v-card-subtitle :style="{ whiteSpace: 'normal', lineHeight: '1.4rem' }" class="text-center">Only WAV (stereo,
            16 bit, 44.1 kHz) and
            MP3 (stereo, 320 kbps) are supported</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import type { NuxtError } from '#app';
import { useFileDialog, useDropZone } from '@vueuse/core'

const emits = defineEmits<{
  (e: "done", id: string): void;
}>();

const loading = ref(false);

const { open, onChange } = useFileDialog({
  accept: '*',
  multiple: false,
})

async function onDrop(files: File[] | null) {
  if (!files) {
    return
  }

  console.log('dropped', files)

  await upload(files[0])

  console.log('done???')
}

const dropZoneRef = ref<HTMLDivElement>()
const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop,
  dataTypes: ['audio/mpeg', 'audio/wav', 'audio/wave', 'audio/x-wav', 'audio/x-pn-wav', 'audio/flac', 'audio/x-flac']
})

const { error } = useNotify()

async function upload(file: File) {
  try {
    loading.value = true

    const formData = new FormData()
    formData.append('audio', file)

    const response = await $fetch<{ id: string }>(`${useRuntimeConfig().public.mediaApiDirect}/tracks`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${useUserState().value?.sid}`,
      }
    })

    emits("done", response.id);

    return
  } catch (e) {
    loading.value = false
    error((e as NuxtError).statusMessage || 'An error occurred')
  }
}

onChange(async (files) => {
  console.log('files', files)
  if (!files) {
    console.log('no files')
    return
  }

  await upload(files[0])
})

onMounted(async () => {
  await nextTick()

  console.dir(useCookie('auth_session').value)

  loading.value = false
})
</script>
