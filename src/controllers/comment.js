import { sendDataResponse } from '../utils/responses.js'
import {
  create,
  getAllForPost,
  updateComment,
  createLike
} from '../domain/comment.js'
import { Prisma } from '@prisma/client'

export const createComment = async (req, res) => {
  const { content } = req.body
  const postId = Number(req.params.id)
  if (!content) {
    return sendDataResponse(res, 400, { error: 'Must provide content' })
  }
  try {
    const createdComment = await create(content, postId, req.user.id)
    return sendDataResponse(res, 201, {
      comment: {
        id: createdComment.id,
        content: createdComment.content,
        createdAt: createdComment.createdAt,
        updatedAt: createdComment.updatedAt,
        author: { ...req.user }
      }
    })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2003') {
        return sendDataResponse(res, 404, { error: 'Post does not exist.' })
      }
    }
    return sendDataResponse(res, 500, { error: 'server error' })
  }
}

export const getAllComments = async (req, res) => {
  const postId = Number(req.params.id)
  try {
    const comments = await getAllForPost(postId)

    return sendDataResponse(res, 200, { comments })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2003') {
        return sendDataResponse(res, 404, { error: 'Post does not exist.' })
      }
    }
    return sendDataResponse(res, 500, { error: 'server error' })
  }
}

export const editComment = async (req, res) => {
  const id = Number(req.params.commentid)

  const { content } = req.body
  try {
    if (!req.body.content) {
      return sendDataResponse(res, 400, { error: 'Must provide content' })
    }
    const updatedComment = await updateComment(id, content)
    const updatedCommentWithAuthor = {
      comment: {
        id: updatedComment.id,
        content: updatedComment.content,
        createdAt: updatedComment.createdAt,
        updatedAt: updatedComment.updatedAt,
        author: { ...req.user }
      }
    }

    return sendDataResponse(res, 200, { updatedCommentWithAuthor })
  } catch (e) {
    return sendDataResponse(res, 500, { error: 'server error' })
  }
}

export const likeComment = async (req, res) => {
  const commentId = Number(req.params.commentId)
  const userId = Number(req.user.id)

  try {
    const likedComment = await createLike(userId, commentId)

    return sendDataResponse(res, 201, likedComment)
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2003') {
        return sendDataResponse(res, 404, { error: 'Post does not exist.' })
      }
      if (e.code === 'P2025') {
        return sendDataResponse(res, 404, { error: 'Comment does not exist.' })
      }
      if (e.code === 'P2002') {
        return sendDataResponse(res, 409, {
          error: 'You can not like a comment more than once.'
        })
      }
    }
    console.error(e)
    return sendDataResponse(res, 500, { error: e })
  }
}
