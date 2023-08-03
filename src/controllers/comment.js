// import send from 'send'
import { sendDataResponse, sendErrorResponse } from '../utils/responses.js'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const createComment = async (req, res) => {
  const postId = Number(req.params.postId)
  const { content } = req.body
  const userId = req.user.id

  if (typeof content !== 'string') {
    return sendErrorResponse(res, 400, 'Comment must be a string')
  }

  if (content.length <= 0 || content.length > 240) {
    if (content.length <= 0) {
      return sendErrorResponse(res, 400, 'Comment cannot be empty')
    } else {
      return sendErrorResponse(
        res,
        400,
        'Comment must be 240 characters or fewer'
      )
    }
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        postId,
        content,
        userId
      },
      select: {
        id: true,
        content: true
      }
    })
    return sendDataResponse(res, 201, { comment })
  } catch (e) {
    return sendErrorResponse(res, 500, e.message)
  }
}

export const removeComment = async (req, res) => {
  const commentId = Number(req.body.commentId)
  const user = req.user

  try {
    const commentUser = await prisma.comment.findFirst({
      where: {
        id: commentId
      },
      select: {
        userId: true
      }
    })

    if (!commentUser) {
      return sendErrorResponse(res, 404, 'No comment with that id was found')
    }

    if (commentUser.userId !== user.id && user.role !== 'TEACHER') {
      return sendErrorResponse(
        res,
        401,
        'Students may only delete their own comments'
      )
    } else {
      const deletedComment = await prisma.comment.delete({
        where: {
          id: commentId
        },
        select: {
          id: true,
          content: true
        }
      })
      return sendDataResponse(res, 200, deletedComment)
    }
  } catch (e) {
    return sendErrorResponse(res, 500, e.message)
  }
}

export const getComments = async (req, res) => {
  const { userId, postId, searchString } = req.query

  const searchParams = {}

  if (userId) {
    searchParams.userId = Number(userId)
  }

  if (postId) {
    searchParams.postId = Number(postId)
  }

  if (searchString) {
    searchParams.content = {
      contains: searchString,
      mode: 'insensitive'
    }
  }

  if (Object.keys(searchParams).length === 0) {
    return sendErrorResponse(
      res,
      400,
      'A userId, postId or searchString must be provided'
    )
  }

  try {
    const comments = await prisma.comment.findMany({
      where: searchParams,
      select: {
        id: true,
        updatedAt: true,
        content: true,
        user: {
          select: {
            id: true,
            cohortId: true,
            role: true,
            profile: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })

    const formattedComments = comments.map((comment) => {
      return {
        id: comment.id,
        updatedAt: comment.updatedAt,
        content: comment.content,
        author: {
          id: comment.user.id,
          cohortId: comment.user.cohortId,
          role: comment.user.role,
          firstName: comment.user.profile.firstName,
          lastName: comment.user.profile.lastName
        }
      }
    })

    if (comments.length === 0) {
      return sendErrorResponse(
        res,
        404,
        'No comments found for the given search parameters'
      )
    }

    return sendDataResponse(res, 200, formattedComments)
  } catch (e) {
    return sendErrorResponse(res, 500, e.message)
  }
}
