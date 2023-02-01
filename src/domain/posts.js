import dbClient from '../utils/dbClient.js'

export default class Post {
  static fromDb(post) {
    return new Post(
      post.id,
      post.userId,
      post.content,
      post.createdAt,
      post.updatedAt
    )
  }

  static async fromJson(json) {
    // eslint-disable-next-line camelcase
    const { content } = json

    return new Post(null, null, content)
  }

  constructor(id, userId, content, createdAt, updatedAt) {
    this.id = id
    this.userId = userId
    this.content = content
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  toJSON() {
    return {
      post: {
        id: this.id,
        userId: this.userId,
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
        connectOrCreate: {
          id: this.userId
        }
      }
    }

    const createdPost = await dbClient.post.create({
      data,
      include: {
        user: true
      }
    })

    return Post.fromDb(createdPost)
  }

  static async findById(id) {
    return Post._findByUnique('id', id)
  }

  static async findAll() {
    return Post._findMany()
  }

  static async _findByUnique(key, value) {
    const foundPost = await dbClient.post.findUnique({
      where: {
        [key]: value
      },
      include: {
        user: true
      }
    })

    if (foundPost) {
      return Post.fromDb(foundPost)
    }

    return null
  }

  static async _findMany(key, value) {
    const query = {
      include: {
        user: true
      }
    }

    if (key !== undefined && value !== undefined) {
      query.where = {
        user: {
          [key]: value
        }
      }
    }

    const foundPosts = await dbClient.post.findMany(query)

    return foundPosts.map((post) => Post.fromDb(post))
  }
}
