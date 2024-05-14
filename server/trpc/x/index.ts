import { router } from '../trpc'
import { tracksAdminRouter } from './tracks/admin.router'
import { nftsAdminRouter } from './nfts/admin.router'
import { multisigAdminRouter } from './multisig/protected.router'
import { privateUploadsRouter } from './private-uploads/protected.router'

const adminRouter = router({
  nfts: nftsAdminRouter,
  tracks: tracksAdminRouter
})

const protectedRouter = router({
  multisig: multisigAdminRouter,
  privateUploads: privateUploadsRouter
})

export const appRouter = router({
  admin: adminRouter,
  protected: protectedRouter
})

// export type definition of API
export type AppRouter = typeof appRouter