import dbClient from '../utils/dbClient.js'

export async function createCohort() {
  const createdCohort = await dbClient.cohort.create({
    data: {},
    select: { id: true, createdAt: true, updatedAt: true }
  })

  const { id, createdAt, updatedAt } = createdCohort

  return {
    cohort: {
      id,
      createdAt,
      updatedAt
    }
  }
}

export async function getCohort(cohortId) {
  return await dbClient.cohort.findUnique({
    where: {
      id: cohortId
    },
    include: {
      users: {
        select: {
          email: true,
          role: true,
          profile: true
        }
      }
    }
  })
}

export async function getAllCohorts() {
  return await dbClient.cohort.findMany({
    include: {
      users: {
        select: {
          email: true,
          role: true,
          profile: true
        }
      }
    }
  })
}

export async function addStudent(cohortId, userId) {
  return await dbClient.cohort.update({
    where: { id: cohortId },
    data: {
      users: { connect: { id: userId } }
    },
    include: {
      users: {
        select: {
          id: true,
          email: true,
          cohortId: true,
          role: true
        }
      }
    }
  })
}
