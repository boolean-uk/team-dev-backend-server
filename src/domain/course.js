import dbClient from '../utils/dbClient.js'

export default class Course {
  constructor(id, name, cohorts, modules) {
    this.id = id
    this.name = name
    this.cohorts = cohorts
    this.modules = modules
  }

  static fromDb(course) {
    return new Course(course.id, course.name, course.cohorts, course.modules)
  }

  static async fromJson(json) {
    const { name } = json

    return new Course(null, name, [], [])
  }

  toJSON() {
    return {
      course: {
        id: this.id,
        name: this.name,
        cohorts: this.cohorts,
        modules: this.modules
      }
    }
  }

  /**
   * @returns {Course}
   */

  async save() {
    const data = {
      name: this.name
    }

    const createdCourse = await dbClient.course.create({
      data,
      include: {
        cohorts: true,
        modules: true
      }
    })
    return Course.fromDb(createdCourse)
  }
}
