<template>
  <app-page>
    <template #body>
      <AppProfileHeader :address="address" :avatar="user?.avatar" :cover="user?.cover" :username="user?.username"
        :email="user?.email" />

      <AppProfileMarketplaces v-if="user" :marketplaces="marketplaces?.marketplaces" />

      <AppProfileNfts v-if="user" :nfts="nfts" />
    </template>
  </app-page>
</template>

<script setup lang="ts">
import defaultImage from "~/assets/images/og-default-1200.png";
import { isValidAddress } from '@bitsongjs/metadata'

const address = computed(() => useRoute().params.address as string)

watch(address, (value) => {
  if (!isValidAddress(value, "bitsong")) {
    navigateTo("/")
  }
})

const { data: user } = await useFetch(`/api/u/${address.value}`)
const title = computed(() => user?.value?.username ?? address.value)

useSeoMeta({
  title: title.value,
  titleTemplate: '%s | Profile | BitSong Studio',
  description: `Check out ${title.value}'s profile on BitSong Studio, the home of Web3 Music.`,
  twitterCard: "summary_large_image",
  ogImage: user?.value?.avatar ? useIpfsLink(user?.value?.avatar) : defaultImage,
});

const { nfts } = await useProfile(address.value)
const { data: marketplaces } = await useMarketplace(address.value)
</script>