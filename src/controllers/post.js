import { sendDataResponse } from '../utils/responses.js'

const { Prisma } = require('@prisma/client')
const prisma = require('../utils/prisma')

export const create = async (req, res) => {
  const { content } = req.body

  if (!content) {
    return sendDataResponse(res, 400, { content: 'Must provide content' })
  }

  return sendDataResponse(res, 201, { post: { id: 1, content } })
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

export const editPost = async (req, res) => {
  const { content } = req.body
  const edited = await prisma.post.update({
    data: {
      content: content
    }
  })
  return sendDataResponse(res, 201, { post: edited })
}
