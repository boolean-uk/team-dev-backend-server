import dbClient from '../utils/dbClient.js'

export const getAllPostsDb = async () => {
  return await dbClient.post.findMany({
    include: {
      user: {
        select: {
          cohortId: true,
          role: true,
          profile: true
        }
      }
    }
  })
}

export const getPostByIdDb = async (id) => {
  return await dbClient.post.findUnique({
    where: {
      id: id
    }
  })
}
