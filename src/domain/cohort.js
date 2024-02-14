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

export class Cohort {
  constructor(id = null, name = 'default name', users = []) {
    this.id = id
    this.name = name
    this.users = users
  }

  static fromDb(cohort) {
    return new Cohort(cohort)
  }

  static async _findMany() {
    return dbClient.cohort.findMany()
  }

  static async getAll() {
    const foundCohorts = await Cohort._findMany()
    const cohortList = foundCohorts.map(Cohort.fromDb)
    return cohortList
  }

  toJSON() {
    return {
      cohort: {
        id: this.id
      }
    }
  }
}
