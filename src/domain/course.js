import dbClient from '../utils/dbClient.js'

export async function createCourse(name) {
  return await dbClient.course.create({
    data: {
      name: name
    }
  })
}
