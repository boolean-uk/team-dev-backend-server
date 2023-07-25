import { sendDataResponse } from '../utils/responses.js'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const create = async (req, res) => {
  const { content } = req.body
  const userId = req.user.id
  const user = req.user

  console.log(user)

  if (!content || content === '') {
    return sendDataResponse(res, 400, { content: 'Must provide valid content' })
  }

  const createdPost = await prisma.post.create({
    data: {
      content: content,
      userId: userId
    }
  })

  return sendDataResponse(res, 201, {
    post: createdPost,
    user: user
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
