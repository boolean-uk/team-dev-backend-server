import { sendDataResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const { date, cohortId, lines } = req.body

  return sendDataResponse(res, 201, {
    log: {
      id: 1,
      cohortId: cohortId,
      date,
      title: 'test',
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

export const update = async (req, res) => {
  const { logId } = parseInt(req.params.id)
  const { data } = req.body
  console.log(logId, data)
}
