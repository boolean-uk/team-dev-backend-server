import dbClient from '../utils/dbClient.js'

export default class Teacher {
  constructor(id = null, user = null, departmentId = null) {
    this.id = id
    this.user = user
    this.departmentId = departmentId
  }

  static fromDb(teacher) {
    return new Teacher(teacher.id, teacher.user, teacher.departmentId)
  }

  static async _findUnique(key, value) {
    return dbClient.teacher.findUnique({
      where: {
        [key]: value
      },
      include: {
        department: true,
        user: {
          include: {
            profile: true
          }
        }
      }
    })
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

  static async getTeacherBy(teacherId) {
    const teacher = await Teacher._findUnique('teacherId', teacherId)
    return teacher
  }

  static async findByUserId(userId) {
    const teacher = await Teacher._findUnique('userId', userId)
    return Teacher.fromDb(teacher)
  }

  static async getAll() {
    const foundTeachers = await Teacher._findMany()
    const allTeachers = foundTeachers.map(Teacher.fromDb)

    return allTeachers
  }
}
