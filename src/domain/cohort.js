import dbClient from '../utils/dbClient.js'

/**
 * Create a new Cohort in the database
 * @returns {Cohort}
 */
export async function createCohort(request) {
  const { cohortName = null, startDate, endDate } = request
  const createdCohort = await dbClient.cohort.create({
    data: {
      cohortName: cohortName,
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    }
  })

  return new Cohort(createdCohort.id, cohortName, startDate, endDate)
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
  const cohort = await dbClient.cohort.findUnique({
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
  return { cohort }
}

export async function deleteCohort(id) {
  const cohort = await dbClient.cohort.delete({
    where: {
      id: id
    }
  })
  return { cohort }
}

export class Cohort {
  constructor(id, name, startDate, endDate) {
    this.id = id
    this.cohortName = name
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
}
