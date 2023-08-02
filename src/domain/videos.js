import dbClient from '../utils/dbClient.js'

export async function getAllVideos(id) {
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
