import { getAllVideos, getAllCohortVideos } from '../domain/videos.js'
import { getCohort } from '../domain/cohort.js'

import { sendDataResponse, sendErrorResponse } from '../utils/responses.js'

export async function getVideosByCohort(req, res) {
  const id = Number(req.params.id)
  try {
    const foundCohort = await getCohort(id)
    if (!foundCohort) {
      return sendErrorResponse(res, 404, 'Cohort not found')
    }
    const videos = await getAllCohortVideos(id)
    return sendDataResponse(res, 200, videos)
  } catch (error) {
    return sendErrorResponse(res, 500, error)
  }
}

export async function getVideos(req, res) {
  try {
    const videos = await getAllVideos()
    return sendDataResponse(res, 200, videos)
  } catch (error) {
    return sendErrorResponse(res, 500, 'Unable to get all video recordings')
  }
}
