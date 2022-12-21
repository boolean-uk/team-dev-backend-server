import dbClient from '../utils/dbClient.js'

/**
 * Create a post class
 * @param {content: string, userId: int}
 * @returns {Post}
 */
export default class Post {
  static fromDb(post) {
    return new Post(post.content, post.userId)
  }

  static fromJson(content, userId) {
    return new Post(content, userId)
  }

  constructor(content, userId) {
    this.content = content
    this.userId = userId
  }

  async savePost() {
    const post = await dbClient.post.create({
      data: {
        content: this.content,
        user: {
          connect: {
            id: Number(this.userId)
          }
        }
      }
    })
    return Post.fromDb(post)
  }

  static async updatePost(postId, content) {
    const post = await dbClient.post.update({
      where: { id: postId },
      data: { content }
    })
    return Post.fromDb(post)
  }

  static async deletePost(postId) {
    const post = await dbClient.post.delete({
      where: { id: postId }
    })
    return Post.fromDb(post)
  }

  static async deletePostComments(postId) {
    const deletedComments = await dbClient.comment.deleteMany({
      where: {
        postId: Number(postId)
      }
    })
    return deletedComments
  }

  static async findPost(postId, includeComments = false) {
    const post = await dbClient.post.findUnique({
      where: {
        id: Number(postId)
      },
      include: {
        comment: includeComments
      }
    })
    if (post) {
      return post
    }
  }

  static async findAll() {
    const posts = await dbClient.post.findMany({
      include: {
        user: true
      }
    })
    if (posts) {
      return posts
    }
  }

  static async isLiked(postId, userId) {
    const relation = await dbClient.like.findMany({
      where: {
        postId: Number(postId),
        userId: Number(userId)
      }
    })
    return !!relation.length
  }

  static async likeAPost(post, userId) {
    const likedPost = await dbClient.like.create({
      data: {
        post: {
          connect: {
            id: Number(post.id)
          }
        },
        userId
      }
    })
    return likedPost
  }

  static async unlike(postId, userId) {
    const unLikedPost = await dbClient.like.findMany({
      where: {
        postId: Number(postId),
        userId
      }
    })
    const deletedUnlikedPost = await dbClient.like.delete({
      where: {
        id: Number(unLikedPost[0].id)
      }
    })

    return deletedUnlikedPost
  }
}
