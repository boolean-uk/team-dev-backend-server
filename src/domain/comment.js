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

export async function createLike(userId, commentId) {
  return await dbClient.likeComment.create({
    data: {
      user: {
        connect: {
          id: userId
        }
      },
      comment: {
        connect: {
          id: commentId
        }
      }
    },
    include: {
      user: {
        select: {
          id: true,
          cohortId: true,
          role: true,
          profile: true
        }
      },
      comment: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              cohortId: true,
              role: true,
              profile: true
            }
          },
          post: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              updatedAt: true,
              user: {
                select: {
                  id: true,
                  cohortId: true,
                  role: true,
                  profile: true
                }
              }
            }
          }
        }
      }
    }
  })
}
