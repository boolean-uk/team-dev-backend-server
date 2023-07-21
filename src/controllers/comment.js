import { sendDataResponse } from '../utils/responses.js'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const createComment = async (req, res) => {
  const postId = Number(req.params.postId)
  const { content } = req.body
  const userId = req.user.id

  if (typeof content !== 'string') {
    return sendDataResponse(res, 400, {
      error: 'Please enter a valid text comment'
    })
  }

  if (content.length <= 0 || content.length > 240) {
    if (content.length <= 0) {
      return sendDataResponse(res, 400, { error: 'Comment cannot be empty' })
    } else {
      return sendDataResponse(res, 400, {
        error: 'Comment must be 240 characters or fewer'
      })
    }
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        postId,
        content,
        userId
      }
    })
    return sendDataResponse(res, 201, { comment })
  } catch (e) {
    return sendDataResponse(res, 500, { error: e.message })
  }
}

export const remove = async (req, res) => {}
