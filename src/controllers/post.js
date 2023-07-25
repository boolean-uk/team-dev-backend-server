import { sendDataResponse } from '../utils/responses.js'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const { Prisma } = require('@prisma/client')
const prisma = require('../utils/prisma')

export const create = async (req, res) => {
  const { content } = req.body
  const userId = req.user.id

  if (!content || content === '' || typeof content !== 'string') {
    return sendDataResponse(res, 400, { content: 'Must provide valid content' })
  }

  const createdPost = await prisma.post.create({
    data: {
      content: content,
      userId: userId
    },
    select: {
      id: true,
      content: true
    }
  })

  return sendDataResponse(res, 201, {
    post: createdPost
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

export const editPost = async (req, res) => {
  const { content } = req.body
  const userId = req.user.id
  console.log('id', userId);
  const edited = await prisma.post.update({
    data: {
      content: content
    }
  })
  return sendDataResponse(res, 201, { post: edited })
}
