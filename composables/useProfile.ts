import { useQuery } from '@tanstack/vue-query'

export interface ProfileNft {
  nft: string;
  name: string;
  subtitle: string;
  image: string;
  totalIds: number;
  tokenIds: string[];
  value: number;
}

export interface ProfileNftsResponse {
  totalCount: number;
  totalValue: number;
  nfts: ProfileNft[]
}

export async function useProfile(address: string) {
  const sortBy = ref<"value">('value')

  function setSortBy(value: 'value') {
    sortBy.value = value
  }

  const { data: nfts, isFetching } = useQuery({
    queryKey: ['profile', address, 'nfts2'],
    queryFn: async () => {
      const data = await $fetch<ProfileNftsResponse>(`${useRuntimeConfig().public.mediaApiDirect}/u/${address}/nfts`)

      return data.nfts.sort((a, b) => {
        if (sortBy.value === 'value') {
          return Number(b.value) - Number(a.value)
        }

        return 0
      })
    },
    staleTime: 1000 * 60 * 2, // 1 minute,
    refetchIntervalInBackground: true,
    refetchInterval: 1000 * 60 * 1, // 1 minute,
  })

  return {
    nfts,
    isFetching,
    setSortBy
  }
}