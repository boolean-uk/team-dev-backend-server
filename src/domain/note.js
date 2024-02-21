import dbClient from '../utils/dbClient.js'

export default class Note {
  /**
   * @param {number} id
   * @param {string} title
   * @param {string} content
   * @param {{firstName: string, lastName: string, userId: number}} studentProfile
   * @param {{firstName: string, lastName: string, userId: number}} teacherProfile
   */
  constructor(id, title, content, studentProfile, teacherProfile) {
    this.id = id
    this.title = title
    this.content = content
    this.studentProfile = studentProfile
    this.teacherProfile = teacherProfile
  }

  static fromDb(note) {
    return new Note(
      note.id,
      note.title,
      note.content,
      note.student.user.profile,
      note.teacher.user.profile
    )
  }

  /**
   * @param {string} title
   * @param {string} content
   * @param {number} studentUserId
   * @param {number} teacherUserId
   * @returns {Promise<Note>}
   */
  static async create(title, content, studentUserId, teacherUserId) {
    const profileSelect = {
      select: {
        user: {
          select: {
            profile: {
              select: {
                userId: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    }

    const createdNote = await dbClient.note.create({
      data: {
        title,
        content,
        student: {
          connect: {
            userId: studentUserId
          }
        },
        teacher: {
          connect: {
            userId: teacherUserId
          }
        }
      },
      select: {
        id: true,
        title: true,
        content: true,
        student: profileSelect,
        teacher: profileSelect
      }
    })

    return Note.fromDb(createdNote)
  }
}
