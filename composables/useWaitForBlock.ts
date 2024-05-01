export async function useWaitForBlock(height: number): Promise<void> {

  const fetchStatus = async () => {
    const result = await $fetch(`/api/indexer/status`)
    return result.lastProcessedHeight
  }

  let currentHeight = await fetchStatus()

  while (currentHeight < height) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    currentHeight = await fetchStatus()
  }

  return
}