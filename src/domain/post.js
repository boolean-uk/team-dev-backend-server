import dbClient from '../utils/dbClient.js'

export async function createPost(content, userId) {
  const createdPost = await dbClient.post.create({
    data: {
      content,
      user: {
        connect: {
          id: userId
        }
      }
    },
    include: {
      user: true
    }
  })
  return createdPost
}

export async function getPosts() {
  return await dbClient.post.findMany()
}
