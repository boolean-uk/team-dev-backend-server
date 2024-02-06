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
  const posts = await dbClient.post.findMany({
    include: {
      user: {
        include: {
          profile: true
        }
      }
    }
  })

  const newPostsList = posts.map((post) => {
    const author = post.user.profile
      ? {
          firstName: post.user.profile.firstName,
          lastName: post.user.profile.lastName
        }
      : { firstName: 'unknown', lastName: 'unknown' }

    return {
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      userId: post.user.id,
      author
    }
  })

  return newPostsList
}
