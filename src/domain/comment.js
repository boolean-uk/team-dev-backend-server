import dbClient from '../utils/dbClient.js'

/**
 * Create a Comment class
 * @param {content: string, userId: int, postId: int, commentId: int}
 * @returns {Comment}
 */
export default class Comment {
  static fromDb(comment) {
    return new Comment(
      comment.content,
      comment.userId,
      comment.postId,
      comment.parentId
    )
  }

  static fromJson(content, userId, postId, commentId = null) {
    return new Comment(content, userId, postId, commentId)
  }

  constructor(content, userId, postId, commentId = null) {
    this.content = content
    this.userId = userId
    this.postId = postId
    this.commentId = commentId
  }

  async saveComment() {
    try {
      const comment = await dbClient.comment.create({
        data: {
          content: this.content,
          user: {
            connect: {
              id: this.userId
            }
          },
          post: {
            connect: {
              id: Number(this.postId)
            }
          }
        }
      })
      return Comment.fromDb(comment)
    } catch (e) {
      console.error(e)
    }
  }

  async saveCommentToComment() {
    try {
      const comment = await dbClient.comment.create({
        data: {
          content: this.content,
          user: {
            connect: {
              id: Number(this.userId)
            }
          },
          post: {
            connect: {
              id: Number(this.postId)
            }
          },
          parent: {
            connect: {
              id: Number(this.commentId)
            }
          }
        }
      })

      return Comment.fromDb(comment)
    } catch (e) {
      console.error(e)
    }
  }
}
