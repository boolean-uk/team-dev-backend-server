import { sendDataResponse, sendErrorResponse } from '../utils/responses.js'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const togglePostLike = async (req, res) => {
  const postId = Number(req.params.postId)
  const userId = req.user.id

  try {
    const existingPost = await prisma.post.findUnique({
      where: {
        id: postId
      }
    })

    if (!existingPost) {
      return sendErrorResponse(res, 404, 'Post not found')
    }

    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        postId
      },
      select: {
        id: true,
        userId: true,
        postId: true
      }
    })

    if (existingLike) {
      const like = await prisma.like.delete({
        where: {
          id: existingLike.id
        },
        select: {
          id: true,
          userId: true,
          postId: true
        }
      })
      sendDataResponse(res, 200, { like, liked: false })
    } else {
      const like = await prisma.like.create({
        data: {
          userId,
          postId
        },
        select: {
          id: true,
          userId: true,
          postId: true
        }
      })
      sendDataResponse(res, 201, { like, liked: true })
    }
  } catch (error) {
    sendErrorResponse(res, 500, error.message)
  }
}

export const toggleCommentLike = async (req, res) => {
  const commentId = Number(req.params.commentId)
  const userId = req.user.id

  try {
    const existingComment = await prisma.comment.findUnique({
      where: {
        id: commentId
      }
    })

    if (!existingComment) {
      return sendErrorResponse(res, 404, 'Comment not found')
    }

    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        commentId
      }
    })

    if (existingLike) {
      const like = await prisma.like.delete({
        where: {
          id: existingLike.id
        },
        select: {
          id: true,
          userId: true,
          commentId: true
        }
      })
      sendDataResponse(res, 200, { like, liked: false })
    } else {
      const like = await prisma.like.create({
        data: {
          userId,
          commentId
        },
        select: {
          id: true,
          userId: true,
          commentId: true
        }
      })
      sendDataResponse(res, 201, { like, liked: true })
    }
  } catch (error) {
    sendErrorResponse(res, 500, error.message)
  }
}
