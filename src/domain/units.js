import dbClient from '../utils/dbClient.js'
import { getModuleById } from '../domain/modules.js'

async function _findByUnique(name) {
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

export async function findByUnitName(name) {
  return await _findByUnique(name)
}

export async function findByModuleId(moduleId) {
  return await getModuleById(moduleId)
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
