import dbClient from '../utils/dbClient.js'

export const create = async (content, postId, userId) => {
  return await dbClient.comment.create({
    data: {
      content: content,
      postId: postId,
      userId: userId
    }
  })
}

export const getAllForPost = async (postId) => {
  return await dbClient.comment.findMany({
    where: {
      postId
    },
    orderBy: {
      createdAt: 'asc'
    }
  })
}
