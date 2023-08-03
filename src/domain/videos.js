import dbClient from '../utils/dbClient.js'

export async function getAllCohortVideos(id) {
  console.log('finding exact videos for cohort')
  return await dbClient.cohort.findMany({
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
  return await dbClient.video.findMany({
    include: {
      unit: true
    }
  })
}
