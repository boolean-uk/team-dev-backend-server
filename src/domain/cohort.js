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

  static async findAll() {
    return Cohort._findMany()
  }

  static async _findMany() {
    const foundCohorts = await dbClient.cohort.findMany()
    return foundCohorts
  }
}

export async function getStudentsOfCohort(id) {
  const query = {
    where: {
      id: Number(id)
    },
    include: {
      users: true
    }
  }

  const data = await dbClient.cohort.findUnique(query)
  data.users.forEach((student) => delete student.password)

  return data
}
