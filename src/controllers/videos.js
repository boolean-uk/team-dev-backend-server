import { getVideos } from '../domain/videos'
import { getCohort } from '../domain/cohort.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export async function getAllVideos(req, res) {
  const id = Number(req.params.id)
  try {
    const foundCohort = await getCohort(id)
    if (!foundCohort) {
      return sendMessageResponse(res, 404, 'Cohort not found')
    }
    const videos = getVideos(id) 
    return res.sendDataResponse(videos)
  } catch (error) {
    return
  }
} 
