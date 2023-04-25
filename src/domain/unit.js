import dbClient from '../utils/dbClient.js'

export const getByModule = async (moduleId) => {
  return await dbClient.unit.findMany({
    where: {
      moduleId
    }
  })
}

export const getModule = async (moduleId) => {
  return await dbClient.module.findUnique({
    where: { id: moduleId }
  })
}

export const getByUnitId = async (unitId) => {
  return await dbClient.unit.findUnique({
    where: { id: unitId }
  })
}
