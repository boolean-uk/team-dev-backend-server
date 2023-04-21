import dbClient from '../utils/dbClient.js'

export async function createPost(content, userId) {
  return await dbClient.post.create({
    data: {
      content,
      userId
    }
  })
}

export async function getAllPosts() {
  return await dbClient.post.findMany({
    include: {
      user: {
        select: {
          id: true,
          cohortId: true,
          role: true,
          profile: true
        }
      }
    }
  })
}

export async function findById(id) {
  return await dbClient.post.findUnique({
    where: {
      id: id
    },
    include: {
      user: {
        select: {
          id: true,
          cohortId: true,
          role: true,
          profile: true
        }
      }
    }
  })
}

export async function createLike(userId, postId) {
  return await dbClient.likePost.create({
    data: {
      user: {
        connect: {
          id: userId
        }
      },
      post: {
        connect: {
          id: postId
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
      post: {
        select: {
          id: true,
          content: true,
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
  })
}

export async function deleteById(id) {
  return await dbClient.post.delete({
    where: {
      id
    }
  })
}

export async function updatePostById(id, content) {
  return await dbClient.post.update({
    where: {
      id
    },
    data: {
      content
    },
    include: {
      user: {
        select: {
          id: true,
          role: true
        }
      }
    }
  })
}
