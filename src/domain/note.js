import dbClient from '../utils/dbClient.js'

export default class Note {
  constructor(id, content, userId) {
    this.id = id
    this.content = content
    this.userId = userId
  }

  // we need a toJson function
  toJSON() {
    return {
      id: this.id,
      content: this.content,
      userId: this.userId
    }
  }
}

// Create note function

export async function createNote(userId, content) {
  return await dbClient.note.create({
    data: {
      content,
      user: {
        connect: {
          id: userId
        }
      }
    }
  })
}
