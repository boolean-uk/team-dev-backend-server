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

export const getCommentById = async (commentid) => {
  return await dbClient.comment.findUnique({
    where: {
      id: commentid
    }
  })
}

export const updateComment = async (id, content) => {
  return await dbClient.comment.update({
    where: {
      id
    },
    data: {
      content
    }
  })
}

export const deleteComment = async (id) => {
  return await dbClient.comment.delete({
    where: {
      id
    }
  })
}
