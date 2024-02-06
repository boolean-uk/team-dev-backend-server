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

    if (!author || !author.firstName || !author.lastName) {
      throw new Error(
        `missing profile property on post.user at post with id:${post.id}`
      )
    }

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
