import dbClient from '../utils/dbClient.js'

/**
 * Create a new Cohort in the database
 * @returns {Cohort}
 */
export async function createCohort() {
  const createdCohort = await dbClient.cohort.create({
    data: {}
  })

  return new Cohort(createdCohort.id)
}

export async function getAllCohorts() {
  const allCohorts = await dbClient.cohort.findMany({
    include: {
      users: {
        select: {
          id: true,
          email: true,
          role: true,
          cohortId: true,
          profile: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      }
    }
  })
  return { cohorts: allCohorts }
}

export async function getCohortById(id) {
  const searchedCohort = await dbClient.cohort.findUnique({
    where: {
      id: id
    },
    include: {
      users: {
        select: {
          id: true,
          email: true,
          role: true,
          cohortId: true,
          profile: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      }
    }
  })
  return { cohort: searchedCohort }
}

export class Cohort {
  constructor(id = null) {
    this.id = id
  }

  toJSON() {
    return {
      cohort: {
        id: this.id
      }
    }
  }
}
