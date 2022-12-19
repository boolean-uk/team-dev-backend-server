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

  static async findPost(postId) {
    try {
      const post = await dbClient.post.findUnique({
        where: {
          id: Number(postId)
        }
      })
      if (post) {
        return post
      }
    } catch (e) {
      console.error(e)
    }
  }

  static async isLiked(postId, userId) {
    try {
      const relation = await dbClient.like.findMany({
        where: {
          postId: Number(postId),
          userId: Number(userId)
        }
      })
      return relation
    } catch (e) {
      console.error(e)
    }
  }

  static async likeAPost(post, userId) {
    const likedPost = await dbClient.like.create({
      data: {
        post: {
          connect: {
            id: Number(post.id)
          }
        },
        user: {
          connect: {
            id: Number(userId)
          }
        }
      }
    })
    return likedPost
  }

  static async unlike(like) {
    const unLikedPost = await dbClient.like.delete({
      where: {
        id: like[0].id
      }
    })
    return unLikedPost
  }
}
