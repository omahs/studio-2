import { useFileDialog } from '@vueuse/core'

interface FileQueue {
  status: 'pending' | 'uploading' | 'done' | 'error'
  file: File
}

export default function usePrivateUploads() {
  const uploadQueue = useState<FileQueue[]>(() => [])
  const refetchData = useState<boolean>(() => false)

  const uploadQueueDone = computed(() => uploadQueue.value.filter(item => item.status === 'done'))

  watchDebounced(uploadQueueDone, async () => {
    if (uploadQueueDone.value.length === 0) return

    refetchData.value = true
  }, { debounce: 2000 })

  watch(refetchData, async () => {
    if (!refetchData.value) {
      uploadQueue.value = uploadQueue.value.filter(item => item.status !== 'done')
    }
  })

  const { open: openFileDialog, reset, onChange } = useFileDialog({
    // TODO: accept only mp3, wav, m4a, flac, ogg, wma
    accept: 'audio/*',
  })

  function open() {
    reset()
    openFileDialog()
  }

  onChange(async (files: FileList | null) => {
    if (!files) return

    for (const file of files) {
      uploadQueue.value.push({
        status: 'pending',
        file,
      })
    }

    startUpload()
  })

  async function startUpload() {
    if (uploadQueue.value.filter(item => item.status === 'pending').length === 0) return

    const item = uploadQueue.value.filter(item => item.status === 'pending')[0]
    if (!item) return

    const formData = new FormData()
    formData.append('audio', item.file)

    console.log(`Uploading ${item.file.name}...`)

    item.status = 'uploading'

    try {
      const response = await $fetch<{ success: boolean }>(`${useRuntimeConfig().public.mediaApiDirect}/me/private-uploads`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${useUserState().value?.sid}`
        },
        body: formData,
      })

      if (response.success) {
        console.log(`Uploaded ${item.file.name}`)
        item.status = 'done'
      } else {
        console.error(`Failed to upload ${item.file.name}`)
        item.status = 'error'
      }
    } catch (e) {
      console.error(`Failed to upload ${item.file.name}`)
      item.status = 'error'
    } finally {
      if (uploadQueue.value.filter(item => item.status === 'pending').length > 0) {
        startUpload()
      }
    }
  }

  return {
    uploadQueue,
    refetchData,
    open
  }
}