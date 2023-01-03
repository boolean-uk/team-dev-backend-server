import dbClient from '../utils/dbClient.js'

/**
 * Create a new Delivery Log in the database
 * @param { id: int, date: dateTime, userId: int, cohortId: int, lines: [{id: int, content: string, logId: int}]  }
 * @returns {Log}
 */

export async function createLog(body, user) {
  const { cohortId, sequenceId, lines } = body
  const createdLog = await dbClient.deliveryLog.create({
    data: {
      cohort: {
        connect: { id: cohortId }
      },
      user: {
        connect: { id: user.id }
      },
      sequence: {
        connect: { id: sequenceId }
      }
    }
  })

  lines.forEach(async (line) => {
    await dbClient.deliveryLogLine.create({
      data: {
        content: line.content,
        log: {
          connect: { id: createdLog.id }
        }
      }
    })
  })

  const sequence = await dbClient.sequence.findUniqueOrThrow({
    where: { id: sequenceId }
  })

  return new Log(createdLog, user, sequence, lines)
}

export class Log {
  constructor(log, user, sequence, lines) {
    this.id = log.id
    this.cohortId = log.cohortId
    this.sequenceName = sequence.name
    this.date = log.date
    this.author = { ...user }
    this.lines = lines
  }

  toJSON() {
    return {
      log: {
        id: this.id,
        cohortId: this.cohortId,
        sequenceName: this.sequenceName,
        date: this.date,
        author: {
          id: this.author.id,
          first_name: this.author.firstName,
          last_name: this.author.lastName
        },
        lines: this.lines.map((line, index) => {
          return {
            id: index + 1,
            content: line.content
          }
        })
      }
    }
  }
}
