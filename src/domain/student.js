import dbClient from '../utils/dbClient.js'

export default class Student {
  constructor(
    id = null,
    title = null,
    user = null,
    userId = null,
    cohort = null,
    cohortId = null
  ) {
    this.id = id
    this.title = title
    this.user = user
    this.userId = userId
    this.cohort = cohort
    this.cohortId = cohortId
  }

  static fromDb(student) {
    return new Student(
      student.id,
      student.title,
      student.user,
      student.userId,
      student.cohort,
      student.cohortId
    )
  }

  static async _findMany() {
    return dbClient.student.findMany({
      include: {
        cohort: true,
        user: {
          select: {
            profile: true
          }
        }
      }
    })
  }

  static async _findManyWhere(key, value) {
    return dbClient.student.findMany({
      where: {
        [key]: value
      },
      include: {
        user: {
          select: {
            profile: true
          }
        }
      }
    })
  }

  static async _findUniqueWhere(key, value) {
    return dbClient.student.findUnique({
      where: {
        [key]: value
      },
      include: {
        user: {
          select: {
            profile: true
          }
        },
        cohort: {
          select: {
            name: true,
            departmentId: true
          }
        }
      }
    })
  }

  static async getAll() {
    const foundStudents = await Student._findMany()

    const allStudents = foundStudents.map(Student.fromDb)
    return allStudents
  }

  static async findByUserId(userId) {
    const foundStudent = await Student._findUniqueWhere('userId', userId)
    const student = Student.fromDb(foundStudent)
    return student
  }

  static async getAllStudentsByCohortId(id) {
    const foundStudents = await Student._findManyWhere('cohortId', id)

    const allStudents = foundStudents.map(Student.fromDb)
    return allStudents
  }

  static async changeCohort(studentId, newCohortId) {
    const studentExists = await dbClient.student.findUnique({
      where: { id: studentId }
    })
    if (!studentExists) throw new Error('Student not found')

    const cohortExists = await dbClient.cohort.findUnique({
      where: { id: newCohortId }
    })
    if (!cohortExists) throw new Error('Cohort not found')

    const updatedStudent = await dbClient.student.update({
      where: { id: studentId },
      data: { cohortId: newCohortId }
    })

    return updatedStudent
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      email: this.user.email,
      firstName: this.user.profile.firstName,
      lastName: this.user.profile.lastName,
      userId: this.userId,
      cohortId: this.cohortId,
      cohort: this.cohort
    }
  }
}
