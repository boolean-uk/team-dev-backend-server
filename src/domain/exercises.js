import dbClient from '../utils/dbClient.js'

export const getAll = async (id) => {
  return await dbClient.exercise.findMany({
    where: {
      id
    }
  })
}
