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
