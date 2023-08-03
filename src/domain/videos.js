import dbClient from '../utils/dbClient.js'

export async function getAllCohortVideos(id) {
  const response = await dbClient.cohort.findMany({
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

  return response
}

export async function getAllVideos() {
  const videos = await dbClient.video.findMany({
    include: {
      unit: true
    }
  })
  return videos
}
