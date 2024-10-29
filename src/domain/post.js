import dbClient from '../utils/dbClient.js'

export default class Post {
  /**
   * Create a Post instance from a database record.
   * @param { { id: int, content: string, createdAt: Date, updatedAt: Date, authorId: int } } post
   * @returns {Post}
   */
  static fromDb(post) {
    return new Post(
      post.id,
      post.content,
      post.createdAt,
      post.updatedAt,
      post.authorId,
      post.user
    )
  }

  static async fromJson(json) {
    const { content, authorId } = json
    return new Post(
      null,
      content,
      null,
      null, // updatedAt will also be set by the database
      authorId
    )
  }

  constructor(id, content, createdAt, updatedAt, authorId, user = null) {
    this.id = id
    this.content = content
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.authorId = authorId
    this.user = user
  }

  toJSON() {
    return {
      id: this.id,
      content: this.content,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      author: {
        id: this.user.id,
        cohortId: this.user.cohort?.id || null,
        firstName: this.user.profile?.firstName || null,
        lastName: this.user.profile?.lastName || null,
        email: this.user.email,
        bio: this.user.profile?.bio || null,
        githubUrl: this.user.profile?.githubUrl || null,
        role: this.user.role
      }
    }
  }

  /**
   * Save the post instance to the database.
   * @returns {Post} A post instance containing an ID, representing the post data created in the database
   */
  async save() {
    const data = {
      content: this.content,
      author: {
        connect: {
          id: this.authorId
        }
      }
    }

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

  static async findManyByAuthorId(authorId) {
    return Post._findMany('authorId', authorId)
  }

  static async _findByUnique(key, value) {
    const foundPost = await dbClient.post.findUnique({
      where: {
        [key]: value
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
        user: {
          include: {
            profile: true,
            cohort: true
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

    return foundPosts.map((post) => Post.fromDb(post))
  }

  static async deleteById(id) {
    const deletedPost = await dbClient.post.delete({
      where: { id }
    })
    return deletedPost
  }
}
