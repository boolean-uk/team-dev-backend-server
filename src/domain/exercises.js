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

export const getExerciseById = async (exerciseId) => {
  return await dbClient.exercise.findUnique({
    where: {
      id: exerciseId
    },
    include: {
      unit: true
    }
  })
}
