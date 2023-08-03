import dbClient from '../utils/dbClient.js'
import { getModuleById } from '../domain/modules.js'

export default class Unit {
  constructor(id, name, moduleId) {
    this.id = id
    this.name = name
    this.moduleId = moduleId
  }

  static async _findByUnique(name) {
    const foundUnit = await dbClient.unit.findUnique({
      where: {
        name
      }
    })

    if (foundUnit) {
      return foundUnit
    }
    return null
  }

  static async findByUnitName(name) {
    return await Unit._findByUnique(name)
  }

  static async findByModuleId(moduleId) {
    return await getModuleById(moduleId)
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name
    }
  }
}
export async function createUnit(name, moduleId) {
  return await dbClient.unit.create({
    data: {
      name,
      module: {
        connect: {
          id: moduleId
        }
      }
    }
  })
}

export async function getUnitById(unitId, name) {
  return await dbClient.unit.findUnique({
    where: {
      id: unitId,
      Name: name
    },
    include: {
      exercises: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })
}
