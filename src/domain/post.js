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
      },
      comments: true,
      likes: true
    }
  })

  const newPostsList = posts.map((post) => {
    const profile = post.user.profile

    if (!profile || !profile.firstName || !profile.lastName) {
      throw new Error(
        `missing profile property on post.user at post with id:${post.id}`
      )
    }

    const author = {
      firstName: profile.firstName,
      lastName: profile.lastName
    }

    return {
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      userId: post.user.id,
      comments: post.comments,
      likes: post.likes,
      author
    }
  })

  return newPostsList
}

async function deletePostByIdAndUserId(postId, userId) {
  const post = await dbClient.post.findUnique({
    where: {
      id: postId
    }
  })

  if (!post) {
    return { error: 'Post not found', status: 404 }
  }

  if (post.userId !== userId) {
    return { error: 'You are not authorized to delete this post', status: 403 }
  }

  await dbClient.post.delete({
    where: {
      id: postId
    }
  })
}

export async function updatePostByIdAndUserId(postId, userId, content) {
  const post = await dbClient.post.findUnique({
    where: { id: postId }
  })

  if (!post) {
    return { error: 'Post not found', status: 404 }
  }

  if (post.userId !== userId) {
    return { error: 'You are not authorized to update this post', status: 403 }
  }

  const updatedPost = await dbClient.post.update({
    where: { id: postId },
    data: { content }
  })

  return { post: updatedPost }
}

export { deletePostByIdAndUserId }
