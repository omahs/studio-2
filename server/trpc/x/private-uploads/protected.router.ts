import { z } from 'zod'
import { protectedProcedure, router } from '../../trpc'

export const privateUploadsRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        limit: z.coerce.number().min(10).max(100).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { database } = ctx
      const uploads = await database.private_uploads.findMany({
        where: {
          user_id: ctx.user.userId
        },
        take: input.limit,
        orderBy: {
          created_at: 'desc',
        },
        select: {
          id: true,
          name: true,
          duration: true,
          artwork_cid: true,
        }
      })

      return uploads
    })
}
)