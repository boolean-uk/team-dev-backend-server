import dbClient from '../utils/dbClient.js'

export async function createPost(content, userId) {
  const post = await dbClient.post.create({
    data: {
      content,
      userId
    }
  })
  return post
}
