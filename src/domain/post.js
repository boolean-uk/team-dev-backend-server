import dbClient from '../utils/dbClient.js'

export default class Post {
  constructor(id, content, userId, likes, author, createdAt, updatedAt) {
    this.id = id
    this.content = content
    this.userId = userId
    this.likes = likes
    this.author = author
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  static async create(content, userId) {
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

    return new Post(
      createdPost.id,
      createdPost.content,
      createdPost.user.id,
      createdPost.likes,
      {
        firstName: createdPost.user.profile.firstName,
        lastName: createdPost.user.profile.lastName
      },
      createdPost.createdAt,
      createdPost.updatedAt
    )
  }

  static async getAll() {
    const posts = await dbClient.post.findMany({
      include: {
        user: {
          include: {
            profile: true
          }
        },
        likes: true
      }
    })

    return posts.map((post) => {
      const { profile } = post.user
      if (!profile || !profile.firstName || !profile.lastName) {
        throw new Error(
          `Missing profile property on post.user at post with id: ${post.id}`
        )
      }

      return new Post(
        post.id,
        post.content,
        post.user.id,
        post.likes,
        {
          firstName: profile.firstName,
          lastName: profile.lastName
        },
        post.createdAt,
        post.updatedAt
      )
    })
  }

  static async deleteById(postId) {
    const deletedPost = await dbClient.post.delete({ where: { id: postId } })

    return deletedPost
  }

  static async updateByIdAndUserId(postId, userId, content) {
    const post = await dbClient.post.findUnique({ where: { id: postId } })

    if (!post) {
      return { error: 'Post not found', status: 404 }
    }

    if (post.userId !== userId) {
      return {
        error: 'You are not authorized to update this post',
        status: 403
      }
    }

    const updatedPost = await dbClient.post.update({
      where: { id: postId },
      data: { content }
    })

    return {
      post: new Post(
        updatedPost.id,
        updatedPost.content,
        updatedPost.userId,
        updatedPost.likes,
        {
          firstName: updatedPost.user.profile.firstName,
          lastName: updatedPost.user.profile.lastName
        },
        updatedPost.createdAt,
        updatedPost.updatedAt
      )
    }
  }

  static async toggleLike(postId, userId) {
    const existingLike = await dbClient.like.findFirst({
      where: {
        AND: [{ postId: postId }, { userId: userId }]
      }
    })

    if (existingLike) {
      await dbClient.like.delete({ where: { id: existingLike.id } })
      return 'Like removed successfully.'
    }

    await dbClient.like.create({
      data: {
        postId,
        userId
      }
    })
    return 'Like added successfully.'
  }

  static async getById(postId) {
    const foundPost = await dbClient.post.findFirst({
      where: {
        id: Number(postId)
      }
    })

    return foundPost
  }
}
