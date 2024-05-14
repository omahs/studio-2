<template>
  <app-page>
    <template #title>
      Private Uploads
    </template>
    <template #append>
      <v-btn v-if="selectedIds.length > 0" :loading="isDeleting" variant="flat" prepend-icon="mdi-delete"
        @click="onDeleteTrack()" color="red">Delete</v-btn>
      <v-btn v-else-if="selectedIds.length === 0"
        :loading="uploadQueue.filter(track => (track.status === 'pending' || track.status === 'uploading')).length > 0"
        variant="flat" prepend-icon="mdi-upload" @click="openPrivateUpload()">Upload</v-btn>
    </template>
    <template #body>
      <v-container fluid class="pt-0">
        <v-row v-for="track in uploadQueue" :key="track.file.name" no-gutters align="center" class="mb-2">
          <v-col cols="auto" class="mr-3">
            <v-icon v-if="track.status === 'pending'">mdi-timer-outline</v-icon>
            <v-progress-circular v-if="track.status === 'uploading'" size="24" indeterminate />
            <v-icon v-if="track.status === 'done'" color="green">mdi-check-bold</v-icon>
            <v-icon v-if="track.status === 'error'" color="red">mdi-close-circle</v-icon>
          </v-col>
          <v-col>
            {{ track.file.name }}
          </v-col>
          <v-col cols="auto" class="mr-3">
            <span class="text-surface-variant">-:--</span>
          </v-col>
          <v-col cols="auto">
            <v-btn variant="text" color="white" icon="mdi-dots-vertical" disabled />
          </v-col>
        </v-row>


        <v-row v-for="track in tracks" :key="track.id" no-gutters align="center" class="mb-2">
          <v-hover>
            <template #default="{ isHovering, props }">
              <v-row no-gutters align="center" v-bind="props">
                <v-col cols="auto" class="mr-3">
                  <NuxtImg :src="track.artwork_cid || `/images/default.png`" height="32" width="32" class="mt-1"
                    @click="play(`private:${track.id}`)" />
                </v-col>
                <v-col>
                  {{ track.name }}
                </v-col>
                <v-col cols="auto">
                  <v-menu location="bottom right">
                    <template #activator="{ props }">
                      <v-btn variant="text" color="white" icon="mdi-dots-vertical" v-bind="props" />
                    </template>

                    <v-list density="compact" :style="{ cursor: 'pointer' }">
                      <v-list-item density="compact" title="Delete" append-icon="mdi-delete"
                        @click="onDeleteTrack(track.id)" />
                    </v-list>
                  </v-menu>
                </v-col>
                <v-col cols="auto" class="mr-3">
                  <input v-if="isHovering || isSelected(track.id)" class="mx-1 ml-2 my-2" type="checkbox"
                    :style="{ width: '20px', height: '20px', cursor: 'pointer' }" @click="selectId(track.id)">
                  <span v-else class="text-surface-variant">{{ toTime(track.duration) }}</span>
                </v-col>
              </v-row>
            </template>
          </v-hover>
        </v-row>

      </v-container>
    </template>
  </app-page>
</template>

<script lang="ts" setup>
import type { NuxtError } from '#app';
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
//import { useWindowScroll } from '@vueuse/core'

definePageMeta({
  middleware: ["protected"]
});

const { play } = usePlayer()

const { uploadQueue, refetchData, open: openPrivateUpload } = usePrivateUploads()

const { $studio } = useNuxtApp();

const queryFn = async () => {
  return await $studio.protected.privateUploads.list.query({
    limit: 100
  })
}

const { isLoading, isPending, isFetching, isError, data: tracks, error, refetch, suspense } = useQuery({
  queryKey: ['me', 'private_uploads'],
  queryFn,
  placeholderData: keepPreviousData
})

onServerPrefetch(async () => {
  await suspense()
})

const isDataLoading = computed(() => isLoading || isPending || isFetching)

watch(refetchData, async () => {
  if (refetchData.value) {
    await refetch()
    refetchData.value = false
  }
}, { immediate: true })

function toTime(seconds: number) {
  const _hours = Math.floor(seconds / 3600);
  const _minutes = Math.floor((seconds % 3600) / 60);
  const _seconds = Math.round(seconds % 60);

  return `${_hours > 0 ? _hours + ":" : ""}${_minutes}:${_seconds < 10 ? "0" + _seconds : _seconds}`;
}

const selectedIds = ref<string[]>([])

function selectId(id: string) {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter(_id => _id !== id)
  } else {
    selectedIds.value = [...selectedIds.value, id]
  }
}

function isSelected(id: string) {
  return selectedIds.value.includes(id)
}

const isDeleting = ref(false)
const { success, error: errorNotify } = useNotify()

async function onDeleteTrack(trackId: string | undefined = undefined) {
  if ((!trackId && selectedIds.value.length === 0)) {
    return errorNotify('Please select a track to delete')
  }

  const confirm = window.confirm('Are you sure you want to delete this track? This action cannot be undone.')
  if (!confirm) return

  try {
    //start()
    isDeleting.value = true
    console.log('trackId', trackId)
    console.log('selectedIds', selectedIds.value)

    const ids = trackId ? [trackId] : selectedIds.value
    console.log(ids)

    await $fetch<{ success: boolean }>(`/media-api/me/private-uploads`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${useUserState().value?.sid}`
      },
      body: {
        ids
      }
    })

    success('Track deleted successfully')
    await refetch()
  } catch (error) {
    console.error(error)
    errorNotify(`${(error as NuxtError).statusMessage || `Something went wrong`}`)
  } finally {
    selectedIds.value = []
    isDeleting.value = false
  }
}
</script>