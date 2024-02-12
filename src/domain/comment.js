import dbClient from '../utils/dbClient.js'

export default class Comment {
  /**
   * @param { {id: int, content; string, postId: int, userId: int, user: { profile: {firstName: string, lastName: string }} createdAt: dateTime, updatedAt: dateTime } } comment
   * @returns {id: int, content; string, postId: int, userId: int, author: {firstName: string, lastName: string } createdAt: dateTime, updatedAt: dateTime }
   */
  constructor(id, content, postId, userId, author, createdAt, updatedAt) {
    this.id = id
    this.content = content
    this.postId = postId
    this.userId = userId
    this.author = author
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  static fromDb(comment) {
    const author = {
      firstName: comment.user.profile.firstName,
      lastName: comment.user.profile.lastName
    }
    return new Comment(
      comment.id,
      comment.content,
      comment.post.id,
      comment.user.id,
      comment.createdAt,
      author,
      comment.updatedAt
    )
  }

  static async _findMany() {
    const comments = await dbClient.comment.findMany({
      include: {
        user: {
          include: {
            profile: true
          }
        },
        post: {
          select: { id: true }
        }
      }
    })
    return comments
  }

  static async getAll() {
    const comments = await Comment._findMany()
    const newCommentList = comments.map(Comment.fromDb)
    return newCommentList
  }
}
