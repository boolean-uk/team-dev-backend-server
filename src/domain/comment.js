import dbClient from '../utils/dbClient.js'

export default class Comment {
  /**
   * @param { {id: int, content; string, postId: int, userId: int, user: { profile: {firstName: string, lastName: string }} createdAt: dateTime, updatedAt: dateTime } } comment
   * @returns {id: int, content; string, postId: int, userId: int, author: {firstName: string, lastName: string } createdAt: dateTime, updatedAt: dateTime }
   */
  constructor(id, content, postId, post, userId, user, createdAt, updatedAt) {
    this.id = id
    this.content = content
    this.postId = postId
    this.post = post
    this.userId = userId
    this.user = user
    this.createdAt = createdAt
    this.updatedAt = updatedAt
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

    const newCommentList = comments.map((comment) => {
      const profile = comment.user.profile

      const author = {
        firstName: profile.firstName,
        lastName: profile.lastName
      }

      return {
        id: comment.id,
        content: comment.content,
        postId: comment.post.id,
        userId: comment.user.id,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        author
      }
    })
    return newCommentList
  }
}
