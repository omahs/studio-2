import prisma from '~/server/utils/db'

export default defineEventHandler(async () => {
  if (!prisma) {
    throw createError({
      message: 'database is not available',
      status: 500
    })
  }

  const result = await prisma.$queryRaw<unknown>`
        SELECT value AS result
        FROM indexer._metadata
        WHERE key = 'lastProcessedHeight'
        UNION ALL
        SELECT value AS result
        FROM indexer._metadata
        WHERE key = 'lastProcessedTimestamp';
    `;

  // @ts-expect-error, improve this
  if (result.length === 0) {
    return {
      lastProcessedHeight: 0,
      lastProcessedTimestamp: 0
    }
  }

  return {
    // @ts-expect-error, improve this
    lastProcessedHeight: parseInt(result[0].result),
    // @ts-expect-error, improve this
    lastProcessedTimestamp: parseInt(result[1].result)
  }
})
