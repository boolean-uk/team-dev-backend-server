import dbClient from '../utils/dbClient.js'
import { getUnitById } from './units.js'

async function _findByUnique(name) {
  const foundExercise = await dbClient.exercise.findUnique({
    where: {
      name
    }
  })
  if (foundExercise) {
    return foundExercise
  }
  return null
}

export async function findByExerciseName(name) {
  return await _findByUnique(name)
}
export async function findByUnitId(unitId) {
  return await getUnitById(unitId)
}

export async function createExercise(name, unitId) {
  return await dbClient.exercise.create({
    data: {
      name,
      unit: {
        connect: {
          id: unitId
        }
      }
    }
  })
}

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
