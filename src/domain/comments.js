import dbClient from '../utils/dbClient.js'

export const createCommentDb = async ({ userId, postId, content }) => {
  const createdComment = await dbClient.comment.create({
    data: {
      content,
      user: {
        content: {
          id: Number(userId)
        }
      },
      post: {
        connect: {
          id: Number(postId)
        }
      }
    }
  })

  return createdComment
}
