import dbClient from '../utils/dbClient.js'

export async function createCourse(name) {
  return await dbClient.course.create({
    data: {
      name: name
    }
  })
}

export async function getCourses() {
  return await dbClient.course.findMany({
    include: {
      cohorts: true,
      modules: true
    }
  })
}

export async function getCourseById(id) {
  return await dbClient.course.findUnique({
    where: {
      id: id
    },
    include: {
      cohorts: true,
      modules: true
    }
  })
}
