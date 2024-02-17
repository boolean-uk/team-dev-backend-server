import dbClient from '../utils/dbClient.js'

export default class Teacher {
  constructor(id = null, userId = null, departmentId = null) {
    this.id = id
    this.userId = userId
    this.departmentId = departmentId
  }

  static async _findMany() {
    return dbClient.teacher.findMany({
      include: {
        user: {
          include: {
            profile: true
          }
        },
        department: true
      }
    })
  }

  static async getAll() {
    const foundTeachers = await Teacher._findMany()

    return foundTeachers
  }
}
