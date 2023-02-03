import dbClient from '../utils/dbClient.js'

export default class Post {
  constructor(id, userId, author, content, createdAt, updatedAt) {
    this.id = id
    this.userId = userId
    this.author = author
    this.content = content
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  static fromDb(post) {
    delete post.author.password
    // console.log(post)
    return new Post(
      post.id,
      post.userId,
      post.author,
      post.content,
      post.createdAt,
      post.updatedAt
    )
  }

  static async fromJson(json) {
    // eslint-disable-next-line camelcase
    const { content } = json

    return new Post(null, null, null, content, null, null)
  }

  toJSON() {
    return {
      post: {
        id: this.id,
        userId: this.userId,
        user: this.author,
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
      data.author = {
        connect: {
          id: this.userId
        }
      }
    }

    if (!this.userId) return null

    const createdPost = await dbClient.post.create({
      data,
      include: {
        author: true
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
        author: true
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
        author: {
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

    const foundPosts = await dbClient.post.findMany(query)
    // console.log('found posts:', foundPosts)

    return foundPosts.map((post) => {
      console.log('mapping', post)
      const dbPost = Post.fromDb(post)
      // console.log(dbPost)
      return dbPost
    })
  }
}
