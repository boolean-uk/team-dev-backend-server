import dbClient from '../utils/dbClient.js'

export const getAll = async (unitId) => {
  return await dbClient.exercise.findMany({
    where: {
      unitId
    }
  })
}

export const getAllForUser = async (userId) => {
  return await dbClient.userExercises.findMany({
    where: {
      userId
    },
    include: {
      exercise: true
    }
  })
}

export const getAllSubmitted = async (userId) => {
  return await dbClient.userExercises.findMany({
    where: {
      userId,
      isSubmitted: true
    },
    include: {
      exercise: true
    }
  })
}
