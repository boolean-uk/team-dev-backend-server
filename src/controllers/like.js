import { sendDataResponse } from '../utils/responses.js'
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
      sendDataResponse(res, 404, { error: 'Post not found' })
    }

    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        postId
      }
    })

    if (existingLike) {
      const like = await prisma.like.delete({
        where: {
          id: existingLike.id
        }
      })
      sendDataResponse(res, 200, { like, liked: false })
    } else {
      const like = await prisma.like.create({
        data: {
          userId,
          postId
        }
      })
      sendDataResponse(res, 201, { like, liked: true })
    }
  } catch (error) {
    sendDataResponse(res, 500, { error: error.message })
  }
}
