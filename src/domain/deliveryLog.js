import dbClient from '../utils/dbClient.js'

export const createDeliveryLogDb = async (cohortId, userId, lines) => {
  const linesArray = Array.isArray(lines) ? lines : []
  const logLines = linesArray.map((line) => ({
    content: line.content
  }))

  return dbClient.deliveryLog.create({
    data: {
      cohort: {
        connect: { id: cohortId }
      },
      user: {
        connect: { id: userId }
      },
      lines: { create: logLines }
    },
    include: {
      user: true,
      lines: true
    }
  })
}
