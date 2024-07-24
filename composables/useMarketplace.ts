import type { BaseMetadata, TrackMetadataDetails } from '@bitsongjs/metadata';
import { useQuery } from '@tanstack/vue-query'

enum ContentSchemaId {
  TRACK_LATEST = "https://json-schemas.bitsong.io/metadata/track/1.0.0.json",
  NFT_LATEST = "https://json-schemas.bitsong.io/metadata/nft/1.0.0.json"
}

type Metadata = BaseMetadata & {
  schema: ContentSchemaId.TRACK_LATEST | ContentSchemaId.NFT_LATEST
  bitsong: TrackMetadataDetails;
};

export interface GetNftResponse {
  address: string
  name: string
  sender: string
  minter: string
  uri: string
  symbol: string
  blockHeight: number
  txHash: string
  createdAt: string
  metadata: Metadata
}

export interface Marketplace {
  address: string
  sender: string
  startTime: string
  nft: GetNftResponse
}

interface GetMarketplacesByCreatorResponse {
  totalCount: number
  marketplaces: Marketplace[]
}

export async function useMarketplace(address: string) {
  const { data, isFetching } = useQuery({
    queryKey: ['profile', address, 'marketplaces'],
    queryFn: async () => {
      return await $fetch<GetMarketplacesByCreatorResponse>(`${useRuntimeConfig().public.mediaApiDirect}/u/${address}/marketplaces`)
    },
    staleTime: 1000 * 60 * 60, // 60 minutes,
    refetchIntervalInBackground: true,
    refetchInterval: 1000 * 60 * 60, // 60 minutes,
  })

  return {
    data,
    isFetching,
  }
}