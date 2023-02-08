import dbClient from '../utils/dbClient.js'

/**
 * Create a new Cohort in the database
 * @returns {Cohort}
 */
export async function createCohort(cohortName, startDate, endDate) {
  const createdCohort = await dbClient.cohort.create({
    data: {
      cohortName,
      startDate,
      endDate
    }
  })

  return new Cohort(createdCohort.id, cohortName, startDate, endDate)
}

export class Cohort {
  constructor(id, cohortName, startDate, endDate) {
    this.id = id
    this.cohortName = cohortName
    this.startDate = startDate
    this.endDate = endDate
  }

  toJSON() {
    return {
      cohort: {
        id: this.id,
        cohortName: this.cohortName,
        startDate: this.startDate,
        endDate: this.endDate
      }
    }
  }

  static fromDb(cohort) {
    return new Cohort(
      cohort.id,
      cohort.cohortName,
      cohort.startDate,
      cohort.endDate
    )
  }

  static async findById(id) {
    return Cohort._findByUnique('id', id)
  }

  static async _findByUnique(key, value) {
    const foundCohort = await dbClient.cohort.findUnique({
      where: {
        [key]: value
      }
    })

    if (foundCohort) {
      return foundCohort
    }

    return null
  }

  static async findAll() {
    return Cohort._findMany()
  }

  static async _findMany() {
    const foundCohorts = await dbClient.cohort.findMany()

    return foundCohorts.map((cohort) => Cohort.fromDb(cohort))
  }
}
