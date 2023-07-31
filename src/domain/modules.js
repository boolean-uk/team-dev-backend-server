import dbClient from '../utils/dbClient.js'

export default class Module {
  /**
   *
   * @param {{id: int, module: String}}
   * @returns {Module}
   */
  constructor(id, moduleName, courseId) {
    this.id = id
    this.moduleName = moduleName
    this.courseId = courseId
  }

  static async _findByUnique(moduleName) {
    const foundModule = await dbClient.module.findUnique({
      where: {
        moduleName
      }
    })

    if (foundModule) {
      return foundModule
    }

    return null
  }

  static async findByModuleName(moduleName) {
    return await Module._findByUnique(moduleName)
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
