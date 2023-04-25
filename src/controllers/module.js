import { getModules } from '../domain/module.js'
import { sendDataResponse } from '../utils/responses.js'

export const getAll = async (req, res) => {
  try {
    const allModules = await getModules()
    return sendDataResponse(res, 200, allModules)
  } catch (e) {
    return sendDataResponse(res, 500, { error: e.message })
  }
}
