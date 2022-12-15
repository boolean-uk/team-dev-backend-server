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
              lastName: true,
              bio: true,
              githubUrl: true
            }
          }
        }
      }
    }
  })
  return { cohorts: allCohorts }
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
