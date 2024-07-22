<template>
  <v-card variant="text" rounded="lg">
    <v-img cover :src="cover" :aspect-ratio="4 / 1" />
    <div class="d-flex justify-space-between mx-4">
      <v-avatar v-if="!avatar" color="surface-variant" size="125" class="profile-avatar" />
      <v-avatar v-else size="125" class="profile-avatar">
        <v-img :src="avatar" cover :alt="address" :aspect-ratio="1 / 1" />
      </v-avatar>

      <v-btn v-if="canEdit" rounded="pill" class="mt-4" variant="outlined"
        @click.stop="editProfileDialog = true; useAppEvent('open-edit-profile')">
        Edit Profile
      </v-btn>
    </div>
  </v-card>

  <v-container fluid>
    <v-row align="center">
      <v-col cols="12" lg="6">
        <div class="text-h4">
          <div v-if="username" class="text-h4">{{ username }}</div>
          <div v-else class="text-h4">
            {{ formatShortAddress(address, 12) }}
            <AppCopyBtn :text="address" />
          </div>
        </div>
        <div v-if="username" class="text-h5 text-surface-variant" :style="{ lineHeight: '1.5rem' }">
          {{ formatShortAddress(address, 12) }}
          <AppCopyBtn :text="address" />
        </div>
      </v-col>

      <v-skeleton-loader v-if="isLoadingNfts || isPendingNfts || isFetchingNfts" width="200" class="mx-2"
        type="list-item-two-line"></v-skeleton-loader>
      <v-col v-else cols="6" lg="" class="text-lg-right">
        <div class="text-caption text-surface-variant font-weight-bold text-uppercase"> NFTs Balance </div>
        <div>
          {{ formatNumber(nfts?.totalValue || 0) }} BTSG
          <v-tooltip activator="parent" location="top center">{{ nfts?.totalValue || 0 }} BTSG</v-tooltip>
        </div>
      </v-col>

      <v-skeleton-loader v-if="isLoading || isPending || isFetching" width="200" class="mx-2"
        type="list-item-two-line"></v-skeleton-loader>
      <v-col v-else cols="6" lg="" class="text-lg-right">
        <div class="text-caption text-surface-variant font-weight-bold text-uppercase"> Total Mint </div>
        <div>
          {{ formatNumber(summary?.mint.volume || 0) }} BTSG
          <v-tooltip activator="parent" location="top center">{{ summary?.mint.volume || 0 }} BTSG</v-tooltip>
        </div>
      </v-col>

      <v-skeleton-loader v-if="isLoading || isPending || isFetching" width="200" class="mx-2"
        type="list-item-two-line"></v-skeleton-loader>
      <v-col v-else cols="6" lg="" class="text-lg-right">
        <div class="text-caption text-surface-variant font-weight-bold text-uppercase"> Total Burn </div>
        <div>
          {{ formatNumber(summary?.burn.volume || 0) }} BTSG
          <v-tooltip activator="parent" location="top center">{{ summary?.burn.volume || 0 }} BTSG</v-tooltip>
        </div>
      </v-col>
    </v-row>
  </v-container>

  <AppProfileEdit v-model="editProfileDialog" :avatar="avatar" :cover="cover" :username="username" :email="email" />
</template>

<script setup lang="ts">
import defaultCover from "~/assets/images/default-cover.png";
import defaultImage from "~/assets/images/default.png";
import { useQuery } from '@tanstack/vue-query'

const user = useUserState()
const canEdit = computed(() => user.value?.address === props.address)

interface Props {
  address: string;
  cover?: string | null;
  avatar?: string | null;
  username?: string | null;
  email?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  cover: undefined,
  avatar: undefined,
  username: undefined,
});

const editProfileDialog = ref(false);

const img = useImage();

const avatar = computed(() => {
  if (props.avatar) return img(useIpfsLink(props.avatar)!, { width: 125, format: 'webp' })
  return defaultImage
})

const cover = computed(() => {
  if (props.cover) return img(useIpfsLink(props.cover)!, { width: 1374, format: 'webp' })
  return defaultCover
})

const { isLoading, isPending, isFetching, data: summary } = useQuery({
  queryKey: ['profile', props.address, 'summary'],
  queryFn: async () => {
    return await $fetch<{
      mint: {
        volume: number;
      },
      burn: {
        volume: number;
      },
    }>(`${useRuntimeConfig().public.mediaApiDirect}/u/${props.address}/summary`)
  },
  staleTime: 1000 * 60, // 1 minutes,
})

const { isLoading: isLoadingNfts, isPending: isPendingNfts, isFetching: isFetchingNfts, data: nfts } = useQuery({
  queryKey: ['profile', props.address, 'nfts'],
  queryFn: async () => {
    return await $fetch<{
      totalValue: number;
    }>(`${useRuntimeConfig().public.mediaApiDirect}/u/${props.address}/nfts`)
  },
  staleTime: 1000 * 60, // 1 minutes
})
</script>

<style scoped>
.profile-avatar {
  margin-top: -58px;
  border: 2px solid white;
}
</style>