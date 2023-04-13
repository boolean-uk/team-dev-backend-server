import { sendDataResponse } from '../utils/responses.js'
import dbClient from '../utils/dbClient.js'

export const create = async (req, res) => {
  const { content } = req.body
  const date = new Date()
  if (!content) {
    return sendDataResponse(res, 400, { error: 'Must provide content' })
  }
  await dbClient.post.create({
    data: {
      content: content,
      userId: req.user.id
    }
  })
  return sendDataResponse(res, 201, {
    post: {
      id: 1,
      content: content,
      createdAt: date,
      updatedAt: date,
      author: { ...req.user }
    }
  })
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
