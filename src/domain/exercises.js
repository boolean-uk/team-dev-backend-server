import dbClient from '../utils/dbClient.js'

export const getAll = async (unitId) => {
  return await dbClient.exercise.findMany({
    where: {
      unitId
    }
  })
}
