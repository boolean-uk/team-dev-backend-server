import dbClient from '../utils/dbClient.js'

export async function createCourse(name) {
  return await dbClient.course.create({
    data: {
      name: name
    }
  })
}

export async function getCourses() {
  return await dbClient.course.findMany()
}

export async function getCourseById(id) {
  return await dbClient.course.findUnique({
    where: {
      id: id
    }
  })
}
