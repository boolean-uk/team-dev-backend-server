import { sendDataResponse } from '../utils/responses.js'
import { Prisma } from '@prisma/client'
import { getAll } from '../domain/exercises.js'

export const getAllByUnit = async (req, res) => {
  const unitId = Number(req.params.id)
  try {
    const exercises = await getAll(unitId)
    return sendDataResponse(res, 200, { exercises })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2003') {
        return sendDataResponse(res, 404, { error: 'Exercises do not exist.' })
      }
    }
    return sendDataResponse(res, 500, { error: 'server error' })
  }
}
