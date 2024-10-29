import dbClient from '../utils/dbClient.js'

export class Post {
  constructor(id = null) {
    this.id = id
  }

  toJSON() {
    return {
      post: {
        id: this.id
      }
    }
  }
}

export async function createPost(content, user) {
  try {
    const post = await dbClient.post.create({
      data: { content: content, userId: user.id }
    })
    return post
  } catch (error) {
    console.error('Error creating post:', error)
    return null
  }
}

export async function getAllPosts() {
  try {
    const posts = await dbClient.post.findMany()
    return posts
  } catch (error) {
    console.error('Error fetching all posts:', error)
    return null
  }
}

export async function getPostById(id) {
  try {
    const post = await dbClient.post.findUnique({
      where: { id: id }
    })
    return post
  } catch (error) {
    console.error('Error fetching post by ID:', error)
    return null
  }
}

export async function updateContentById(id, content) {
  try {
    const post = await dbClient.post.update({
      where: { id: id },
      data: { content: content }
    })
    return post
  } catch (error) {
    console.error('Error updating post content by ID:', error)
    return null
  }
}

export async function deletePostById(id) {
  try {
    const post = await dbClient.post.delete({
      where: { id: id }
    })
    return post
  } catch (error) {
    console.error('Error deleting post by ID:', error)
    return null
  }
}
