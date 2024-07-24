<template>
  <app-page>
    <template #body>
      <AppProfileHeader v-if="user" :address="user.address" :avatar="user.avatar" :cover="user.cover"
        :username="user.username" :email="user.email" />

      <AppProfileNfts v-if="user" :nfts="nfts" />
    </template>
  </app-page>
</template>

<script setup lang="ts">
import defaultImage from "~/assets/images/og-default-1200.png";

definePageMeta({
  middleware: ["protected"]
});

const user = useUserState()
useSeoMeta({
  title: user.value?.username ? user.value?.username : user.value?.address,
  titleTemplate: '%s | Profile | BitSong Studio',
  description: `Check out ${user?.value?.username || user.value?.address}'s profile on BitSong Studio, the home of Web3 Music.`,
  twitterCard: "summary_large_image",
  ogImage: user?.value?.avatar ? useIpfsLink(user?.value?.avatar) : defaultImage,
});

const { nfts } = await useProfile(user.value!.address)
</script>