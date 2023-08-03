import dbClient from '../utils/dbClient.js'
import { getCohort } from './cohort.js'

async function _findByUnique(name) {
  const foundCourse = await dbClient.course.findUnique({
    where: {
      name
    }
  })

  if (foundCourse) {
    return foundCourse
  }
  return null
}
export async function findByCourseName(name) {
  return await _findByUnique(name)
}
export async function findByCohortId(cohortId) {
  return await getCohort(cohortId)
}

export async function createCourse(name, cohortId) {
  return await dbClient.course.create({
    data: {
      name,
      cohorts: {
        connect: {
          id: cohortId
        }
      }
    }
  })
}
