import dbClient from '../utils/dbClient.js'
// import { validateAuthentication, validateIdOrRole } from '../middleware/auth.js'

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

export async function updatePostById(id, content) {
  return await dbClient.post.update({
    where: {
      id
    },
    data: {
      content
    }
    // include: {
    //   user: {
    //     select: {
    //       id: true,
    //       role: true
    //     }
    //   }
    // }
  })
}
