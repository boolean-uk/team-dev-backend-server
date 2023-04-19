import dbClient from '../utils/dbClient.js'

export class DeliveryLog {
  constructor(id, date, title, userId, cohortId, lines) {
    this.id = id
    this.date = date
    this.title = title
    this.userId = userId
    this.cohortId = cohortId
    this.lines = lines
  }

  static async createLog(date, title, userId, cohortId, lines) {
    const data = {
      date: date,
      title: title,
      lines: {
        create: {
          content: lines.content
        }
      },
      user: {
        connect: {
          id: userId
        }
      },
      cohort: {
        connect: {
          id: cohortId
        }
      }
    }

    /**
     * Create a new delivery log in the database
     * @returns {DeliveryLog}
     */
    const createdLog = await dbClient.deliveryLog.create({
      data,
      include: {
        lines: true
      }
    })
    console.log(createdLog)
    return createdLog
  }
}
