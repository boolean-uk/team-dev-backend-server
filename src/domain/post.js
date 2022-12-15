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
}
