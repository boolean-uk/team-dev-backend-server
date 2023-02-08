import dbClient from '../utils/dbClient.js'

export default class Comment {
  constructor(id, userId, user, postId, post, content, createdAt, updatedAt) {
    this.id = id
    this.userId = userId
    this.user = user
    this.postId = postId
    this.post = post
    this.content = content
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  static fromDb(comment) {
    delete comment.user.password
    return new Comment(
      comment.id,
      comment.userId,
      comment.user,
      comment.postId,
      comment.post,
      comment.content,
      comment.createdAt,
      comment.updatedAt
    )
  }

  static async fromJson(json) {
    const { content } = json

    return new Comment(null, null, null, content, null, null)
  }

  toJSON() {
    return {
      post: {
        id: this.id,
        userId: this.userId,
        user: this.user,
        postId: this.postId,
        post: this.post,
        content: this.content,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      }
    }
  }

  async save() {
    const data = {
      content: this.content
    }

    if (this.userId) {
      data.user = {
        connect: {
          id: this.userId
        }
      }
    }

    if (!this.userId) return null

    const createdComment = await dbClient.comment.create({
      data,
      include: {
        user: true
      }
    })
    return Comment.fromDb(createdComment)
  }

  async delete() {
    const deletedComment = await dbClient.post.delete({
      where: {
        id: this.id
      }
    })
    return deletedComment
  }

  static async findById(id) {
    return Comment._findByUnique('id', id)
  }

  static async findAll() {
    return Comment._findMany()
  }

  static async _findByUnique(key, value) {
    const foundComment = await dbClient.comment.findUnique({
      where: {
        [key]: value
      },
      include: {
        user: true
      }
    })

    if (foundComment) {
      return Comment.fromDb(foundComment)
    }

    return null
  }

  static async _findMany(key, value) {
    const query = {
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    }

    if (key !== undefined && value !== undefined) {
      query.where = {
        [key]: value
      }
    }

    const foundPosts = await dbClient.comment.findMany(query)

    return foundPosts.map((post) => Comment.fromDb(post))
  }

  async updateById() {
    const updatedComment = await dbClient.comment.update({
      where: {
        id: this.id
      },
      data: {
        content: this.content
      },
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    })

    return Comment.fromDb(updatedComment)
  }
}
