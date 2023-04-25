import dbClient from '../utils/dbClient.js'

export async function getModulesByCourseId(courseId) {
  return await dbClient.module.findMany({
    where: {
      course: {
        id: courseId
      }
    },
    include: {
      units: true
    }
  })
}

export async function getModuleById(id) {
  return await dbClient.module.findUnique({
    where: {
      id: id
    },
    include: {
      units: true
    }
  })
}
