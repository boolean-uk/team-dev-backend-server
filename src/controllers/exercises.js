import { sendDataResponse } from '../utils/responses.js'
import { Prisma } from '@prisma/client'
import { getAll, getAllForUser } from '../domain/exercises.js'

export const getAllByUnit = async (req, res) => {
  const unitId = Number(req.params.id)
  try {
    const exercises = await getAll(unitId)
    return sendDataResponse(res, 200, { exercises })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2003') {
        return sendDataResponse(res, 404, { error: 'Unit does not exist.' })
      }
    }
    return sendDataResponse(res, 500, { error: 'server error' })
  }
}

export const getAllbyUserId = async (req, res) => {
  const userid = Number(req.params.id)
  try {
    const exercises = await getAllForUser(userid)
    return sendDataResponse(res, 200, { exercises })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2003') {
        return sendDataResponse(res, 404, { error: 'User does not exist.' })
      }
    }
    return sendDataResponse(res, 500, { error: 'server error' })
  }
}
