import { sendDataResponse } from '../utils/responses.js'
import dbClient from '../utils/dbClient.js'

export const create = async (req, res) => {
  const { date, cohort_id: cohortId, lines } = req.body
  const userId = req.user.id

  const createdLog = await dbClient.deliveryLog.create({
    data: {
      cohort: {
        connect: { id: cohortId }
      },
      date: new Date(date),
      user: {
        connect: { id: userId }
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

  return sendDataResponse(res, 201, {
    log: {
      id: 1,
      cohort_id: cohortId,
      date: new Date(date),
      author: {
        id: req.user.id,
        first_name: req.user.firstName,
        last_name: req.user.lastName
      },
      lines: lines.map((line, index) => {
        return {
          id: index + 1,
          content: line.content
        }
      })
    }
  })
}
