import { getAllVideos } from '../domain/videos.js' // import { getCohort } from '../domain/cohort.js'

import { sendDataResponse } from '../utils/responses.js'

// export async function getVideosByCohort(req, res) {
//   const id = Number(req.params.id)
//   try {
//     const foundCohort = await getCohort(id)
//     if (!foundCohort) {
//       return sendMessageResponse(res, 404, 'Cohort not found')
//     }
//     const videos = getAllCohortVideos(id)
//     return res.sendDataResponse(videos)
//   } catch (error) {
//     return res.sendMessageResponse(res, 500, error)
//   }
// }

export async function getVideos(req, res) {
  const videos = getAllVideos()
  return sendDataResponse(res, 200, videos)
}
