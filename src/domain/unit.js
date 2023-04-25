import dbClient from '../utils/dbClient.js'

export const getByModule = async (moduleId) => {
  return await dbClient.unit.findMany({
    where: {
      moduleId
    }
  })
}

export const getByUnitId = async (unitId) => {
  return await dbClient.unit.findUnique({
    where: { id: unitId },
    include: {
      exercises: true
    }
  })
}
