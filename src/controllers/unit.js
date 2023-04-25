import { Prisma } from '@prisma/client'
import {
  sendDataResponse
  // , sendMessageResponse
} from '../utils/responses.js'
import { getByModule } from '../domain/unit.js'

export const getUnitById = async (req, res) => {
  const unitId = Number(req.params.unitId)
  console.log('unitId', unitId)
  try {
    const unit = await getByModule(unitId)
    return sendDataResponse(res, 200, { unit })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2003') {
        return sendDataResponse(res, 404, {
          error: 'Module does not exist.'
        })
      }
    }
    return sendDataResponse(res, 500, { error: 'server error' })
  }
}

export const getUnitByModule = async (req, res) => {
  const moduleId = Number(req.params.moduleId)
  console.log('moduleId', moduleId)

  try {
    const units = await getByModule(moduleId)
    return sendDataResponse(res, 200, { units })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2003') {
        return sendDataResponse(res, 404, { error: 'Module does not exist.' })
      }
    }
    return sendDataResponse(res, 500, { error: 'server error' })
  }
}
