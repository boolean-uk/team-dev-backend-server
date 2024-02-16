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
  constructor(
    id = null,
    name = 'default name',
    users = [],
    departmentId = null,
    department = null
  ) {
    this.id = id
    this.name = name
    this.users = users
    this.departmentId = departmentId
    this.department = department
  }

  static fromDb(cohort) {
    if (!cohort.department || !cohort.department.name) {
      this.department.name = 'default department name'
    }
    const newCohort = new Cohort(
      cohort.id,
      cohort.name,
      cohort.users,
      cohort.departmentId,
      cohort.department
    )
    return newCohort
  }

  static async _findMany() {
    return dbClient.cohort.findMany({
      include: {
        department: {
          select: {
            name: true
          }
        }
      }
    })
  }

  static async getAll() {
    const foundCohorts = await Cohort._findMany()
    const cohortList = foundCohorts.map(Cohort.fromDb)
    return cohortList
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      users: this.users,
      departmentId: this.departmentId,
      department: this.department
    }
  }
}
