import { getUnitById } from '../domain/unit.js'
import { sendDataResponse } from '../utils/responses.js'

export const getAll = async (req, res) => {
  try {
    const unitId = parseInt(req.params.id, 10)
    const units = await getUnitById(unitId)

    if (!units) {
      return sendDataResponse(res, 404, 'Units not found')
    }
    return sendDataResponse(res, 200, units)
  } catch (error) {
    console.error(error)
    return sendDataResponse(res, 500, 'Unable to get Units')
  }
}
