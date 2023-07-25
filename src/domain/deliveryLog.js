import dbClient from '../utils/dbClient.js'

export default class DeliveryLog {
  constructor(id, date, title, cohortId, lines, userId) {
    this.id = id
    this.date = date
    this.title = title
    this.cohortId = cohortId
    this.userId = userId
    this.lines = lines
  }

  toJSON() {
    return {
      id: this.id,
      date: this.date.splice(0, 10),
      title: this.title,
      cohortId: this.cohortId,
      userId: this.userId,
      lines: this.lines
    }
  }
}

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
