import dbClient from '../utils/dbClient.js'

export async function getAllCohortVideos(id) {
  return await dbClient.cohort.findUnique({
    where: {
      id
    },
    include: {
      courses: {
        include: {
          modules: {
            include: {
              units: {
                include: {
                  videos: true
                }
              }
            }
          }
        }
      }
    }
  })
}

export async function getAllVideos() {
  return await dbClient.video.findMany({})
}
