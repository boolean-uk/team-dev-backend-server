import dbClient from '../utils/dbClient.js'

export async function createLog(date, cohortId, lines, user, title) {
  const createdLog = await dbClient.deliveryLog.create({
    data: {
      title,
      date,
      userId: user.id,
      cohortId,
      lines: {
        create: lines
      }
    }
  })

  const author = {
    id: user.id,
    first_name: user.firstName,
    last_name: user.lastName
  }

  return new DeliveryLog(
    createdLog.id,
    date,
    title,
    cohortId,
    lines,
    author,
    user
  )
}

export class DeliveryLog {
  constructor(id, date, title, cohortId, lines, author) {
    this.id = id
    this.date = date
    this.title = title
    this.cohortId = cohortId
    this.author = author
    this.lines = lines
  }

  static async findById(id) {
    return DeliveryLog._findByUnique('id', id)
  }

  static async _findByUnique(key, value) {
    const foundLog = await dbClient.deliveryLog.findUnique({
      where: {
        [key]: value
      }
    })

    if (foundLog) {
      return foundLog
    }

    return null
  }
}
