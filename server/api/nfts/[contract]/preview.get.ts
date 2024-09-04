import useCurveSimulator from "~/server/utils/curve_simulator"

interface Preview {
  id: string
  title: string
  artists: string[]
  description: string
  creator: string
  sellerFeeBps: number
  referralFeeBps: number
  previewUrl: string
  artworkUrl: string
  startTime: number
  genre: string
  explicit: string
  license: string
  initialPrice: number
  nftAddress: string
  marketplaceAddress: string
}

const slugify = (str: string) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default defineEventHandler(async (event) => {
  const contract = getRouterParam(event, 'contract')

  if (!prisma) {
    throw createError({
      message: 'database is not available',
      status: 500
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nft_info: any = await $fetch(`${useRuntimeConfig().public.mediaApi}/nfts/${contract}`)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nft_config: any = await $fetch(`${useRuntimeConfig().public.mediaApi}/nfts/${contract}/config`)

  const initialPrice = useCurveSimulator({
    ratio: nft_config.ratio,
    sellerFeeBps: nft_config.sellerFeeBps,
    referralFeeBps: nft_config.referralFeeBps,
    protocolFeeBps: nft_config.protocolFeeBps,
    totalSupply: nft_config.totalSupply,
  }).buyPrice()

  const nft_db = await prisma.music_nfts.findFirstOrThrow({
    where: {
      id: contract
    }
  })

  // {
  //   id: 'grippin-grain',
  //   title: 'Grippin\' Grain',
  //   artists: ["Goose Pärk", "GiiipsonPoet"],
  //   description: "In the heartbeat of creativity, a rhythm emerged - a beat unexpectedly intertwined with the very soul of Houston, Texas. 🌆✨ What started as a spontaneous creation became an anthem, a shoutout to the vibrant spirit of the Lone Star State.\n\nWhen I crafted this beat, I had no idea it would echo the essence of Houston. But as the lyrics danced in my mind, I couldn't resist capturing the magic on wax. 🎙️✨ This isn't just a song; it's a tribute to the energy, the culture, and the heart of Texas. \nShoutout to GiiipsonPoet for the amazing feature #Yerrr.",
  //   creator: "bitsong13xknrd2t5d28w3rnkly2dx3yxdwr97vhqr4z5w",
  //   sellerFeeBps: 300,
  //   referralFeeBps: 50,
  //   previewUrl: "https://media-api.bitsong.studio/ipfs/QmWSKkYKRdpt7kNT4aATzG6uNMSDxpNj294vLtWosyMnb8",
  //   artworkUrl: "https://media-api.bitsong.studio/ipfs/QmYJSZuA6jCzNsGHRuixpuc4N1GYHUhHvbzVshr24oJ77L",
  //   startTime: 1728928800,
  //   genre: "Hip-Hop",
  //   explicit: "Explicit",
  //   license: "All Rights Reserved",
  //   initialPrice: 0.01033,
  //   nftAddress: "bitsong1lvz4svuk70rrk5dxnvmeg9jhqartetr54addx37t32sgyy73xkesh8kdjp",
  //   marketplaceAddress: "bitsong1845dl7kypw9acg69sgcryf88d2h706jmc6v6hzsuwyzcnqzjjr7q5rl7kj"
  // }

  return {
    id: slugify(nft_info.metadata.bitsong.title),
    title: nft_info.metadata.bitsong.title,
    artists: nft_info.metadata.bitsong.artists.map((a: { name: string }) => a.name),
    description: nft_info.metadata.bitsong.description,
    creator: nft_info.sender,
    sellerFeeBps: parseInt(nft_config.sellerFeeBps),
    referralFeeBps: (parseInt(nft_config.sellerFeeBps) / 10000) * parseInt(nft_config.referralFeeBps),
    previewUrl: nft_db.audio_preview.replace('ipfs://', `${useRuntimeConfig().public.mediaApi}/ipfs/`),
    artworkUrl: nft_info.metadata.bitsong.artwork.replace('ipfs://', `${useRuntimeConfig().public.mediaApi}/ipfs/`),
    startTime: parseInt(nft_config.startTime) / 1000000000,
    genre: nft_info.metadata.bitsong.genre,
    explicit: nft_info.metadata.bitsong.explicit,
    license: nft_info.metadata.bitsong.license,
    initialPrice: initialPrice.total,
    nftAddress: contract,
    marketplaceAddress: nft_config.marketplaceAddress
  } as Preview
})