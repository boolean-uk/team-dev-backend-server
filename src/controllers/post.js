import dbClient from '../utils/dbClient.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const { content, userId } = req.body

  if (!content) {
    return sendMessageResponse(res, 400, { content: 'Must provide content' })
  }

  const post = await dbClient.post.create({
    data: {
      content,
      user: {
        connect: {
          id: Number(userId)
        }
      }
    }
  })

  return sendDataResponse(res, 201, post)
}

export const getAll = async (req, res) => {
  return sendDataResponse(res, 200, {
    posts: [
      {
        id: 1,
        content: 'Hello world!',
        author: { ...req.user }
      },
      {
        id: 2,
        content: 'Hello from the void!',
        author: { ...req.user }
      }
    ]
  })
}
