import dbClient from '../utils/dbClient.js'

export async function createDeliveryLog(date, userId, title, cohortId, lines) {
  return await dbClient.deliveryLog.create({
    data: {
      date,
      title,
      user: {
        connect: {
          id: userId
        }
      },
      cohort: {
        connect: {
          id: cohortId
        }
      },
      lines: {
        create: lines.map((line) => ({ content: line.content }))
      }
    },
    include: {
      lines: true
    }
  })
}

export async function getDeliveryLog(cohortId) {
  return await dbClient.deliveryLog.findMany({
    where: {
      cohort: {
        id: cohortId
      }
    },
    include: {
      lines: true
    }
  })
}
