import dbClient from '../utils/dbClient.js'

export default class Post {
  constructor(
    id,
    userId,
    user,
    content,
    comments,
    createdAt,
    updatedAt,
    likes
  ) {
    this.id = id
    this.userId = userId
    this.user = user
    this.content = content
    this.comments = comments
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.likes = likes
  }

  static fromDb(post) {
    delete post.user.password
    return new Post(
      post.id,
      post.userId,
      post.user,
      post.content,
      post.comments,
      post.createdAt,
      post.updatedAt,
      post.likes
    )
  }

  static async fromJson(json) {
    const { content } = json

    return new Post(null, null, null, content, null, null, [])
  }

  toJSON() {
    return {
      post: {
        id: this.id,
        userId: this.userId,
        user: this.user,
        content: this.content,
        comments: this.comments,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        likes: this.likes
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

    const createdPost = await dbClient.post.create({
      data,
      include: {
        user: true
      }
    })
    return Post.fromDb(createdPost)
  }

  async delete() {
    const deletedPost = await dbClient.post.delete({
      where: {
        id: this.id
      }
    })
    return deletedPost
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
        user: true,
        comments: true,
        likes: true
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

    return foundPosts.map((post) => Post.fromDb(post))
  }

  async updateById() {
    const updatedPost = await dbClient.post.update({
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

    return Post.fromDb(updatedPost)
  }

  async createLike(userId) {
    const likedPost = await dbClient.post.update({
      where: {
        id: this.id
      },
      data: {
        likes: {
          connect: [{ id: userId }]
        }
      },
      include: {
        likes: true
      }
    })

    likedPost.likes.forEach((like) => {
      delete like.password
    })

    return likedPost
  }
}
