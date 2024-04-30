import { H3Event } from 'h3'
import prisma from '~/server/utils/db'

export async function ensureUserTrack(event: H3Event) {
  const user = await ensureAuth(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      message: 'No id',
      status: 400
    })
  }

  const track = await prisma.tracks.findUnique({
    where: {
      id,
      user_id: user.userId,
    },
    include: {
      artists: true,
      authors_publishers: true,
      marketplace: true,
      royalties_info: true,
    }
  })

  if (!track) {
    throw createError({
      message: 'No track found',
      status: 404
    })
  }

  return {
    user,
    track
  }
}
