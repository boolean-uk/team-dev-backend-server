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

  static async findComment(commentId) {
    const comment = await dbClient.comment.findUnique({
      where: {
        id: Number(commentId)
      }
    })
    if (comment) {
      return comment
    }
  }

  static async isLiked(commentId, userId) {
    const relation = await dbClient.like.findMany({
      where: {
        commentId: Number(commentId),
        userId: Number(userId)
      }
    })
    return !!relation.length
  }

  static async likeAComment(comment, userId) {
    const likedComment = await dbClient.like.create({
      data: {
        comment: {
          connect: {
            id: Number(comment.id)
          }
        },
        userId
      }
    })
    return likedComment
  }

  static async unlike(commentId, userId) {
    const unLikedComment = await dbClient.like.findMany({
      where: {
        commentId: Number(commentId),
        userId
      }
    })
    const deletedUnlikedComment = await dbClient.like.delete({
      where: {
        id: Number(unLikedComment[0].id)
      }
    })

    return deletedUnlikedComment
  }
}
