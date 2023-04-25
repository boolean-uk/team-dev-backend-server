import { sendDataResponse } from '../utils/responses.js'
import { getByModule, getByUnitId } from '../domain/unit.js'

export const getUnitById = async (req, res) => {
  const unitId = Number(req.params.unitId)
  try {
    const unit = await getByUnitId(unitId)
    if (!unit) {
      return sendDataResponse(res, 404, { error: 'Unit not found' })
    }
    return sendDataResponse(res, 200, { unit })
  } catch (e) {
    return sendDataResponse(res, 500, { error: 'server error' })
  }
}

export const getUnitsByModule = async (req, res) => {
  const moduleId = Number(req.params.moduleId)

  try {
    const units = await getByModule(moduleId)
    return sendDataResponse(res, 200, { units })
  } catch (e) {
    return sendDataResponse(res, 500, { error: 'server error' })
  }
}
