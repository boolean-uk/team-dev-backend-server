import dbClient from '../utils/dbClient.js'

export default class Module {
  /**
   *
   * @param {{id: int, module: String}}
   * @returns {Module}
   */
  constructor(id, moduleName) {
    this.id = id
    this.moduleName = moduleName
  }

  toJSON() {
    return {
      id: this.id,
      moduleName: this.moduleName
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
