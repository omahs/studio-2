import { useQuery } from '@tanstack/vue-query'

export interface ProfileNftsResponse {
  totalCount: number;
  totalValue: number;
  nfts: {
    nft: string;
    name: string;
    image: string;
    totalIds: number;
    tokenIds: string[]
    value: number;
  }[]
}

export async function useProfile(address: string) {
  const sortBy = ref<"value">('value')

  function setSortBy(value: 'value') {
    sortBy.value = value
  }

  const { data, isFetching } = useQuery({
    queryKey: ['profile', address, 'nfts'],
    queryFn: async () => {
      return await $fetch<ProfileNftsResponse>(`${useRuntimeConfig().public.mediaApiDirect}/u/${address}/nfts`)
    },
    staleTime: 1000 * 60 * 5, // 5 minutes,
  })

  const nfts = computed(() => {
    if (!data.value) return []
    return data.value.nfts.sort((a, b) => {
      if (sortBy.value === 'value') {
        return b.value - a.value
      }
      return 0
    })
  })

  return {
    nfts,
    isFetching,
    setSortBy
  }
}