import dbClient from '../utils/dbClient.js'

export default class Module {
  /**
   *
   * @param {{id: int, module: String}}
   * @returns {Module}
   */
  constructor(id, module) {
    this.id = id
    this.module = module
  }

  toJSON() {
    return {
      id: this.id,
      content: this.content
    }
  }
}

export async function createModule(moduleName, courseId) {
  return await dbClient.module.create({
    data: {
      moduleName,
      courses: {
        connectOrCreate: {
          create: {
            id: courseId,
            courseName: 'Software Development'
          },
          where: {
            id: courseId
          }
        }
      }
    }
  })
}
