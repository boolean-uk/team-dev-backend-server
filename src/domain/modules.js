import dbClient from '../utils/dbClient.js'

export default class Module {
  /**
   *
   * @param {{id: int, module: String}}
   * @returns {Module}
   */
  constructor(id, name, courseId) {
    this.id = id
    this.name = name
    this.courseId = courseId
  }

  static async _findByUnique(key, value) {
    const foundModule = await dbClient.module.findUnique({
      where: {
        [key]: value
      }
    })

    if (foundModule) {
      return foundModule
    }

    return null
  }

  static async _findModule(key, value) {
    const foundModule = await dbClient.module.findUnique({
      where: {
        [key]: value
      }
    })

    if (foundModule) {
      return foundModule
    }
    return null
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name
    }
  }
}

export async function findByModuleName(name) {
  return await Module._findByUnique('name', name)
}
// THIS BLOCK OF CODE WILL CHANGE WHEN THE COURSE ENDPOINT IS MADE
export async function createModule(name, courseId) {
  return await dbClient.module.create({
    data: {
      name,
      courses: {
        connectOrCreate: {
          create: {
            id: courseId,
            name: 'Software Development'
          },
          where: {
            id: courseId
          }
        }
      }
    }
  })
}
// ------------------------------------

export async function updateModuleDetails(moduleId, name, courseId) {
  return await dbClient.module.update({
    where: {
      id: moduleId
    },
    data: {
      name,
      courses: {
        connect: { id: courseId }
      }
    }
  })
}

export async function getModuleById(moduleId) {
  return await dbClient.module.findUnique({
    where: {
      id: moduleId
    },
    include: {
      units: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })
}
