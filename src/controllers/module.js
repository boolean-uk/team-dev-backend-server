import { getModules, getModuleById } from '../domain/module.js'
import { sendDataResponse } from '../utils/responses.js'

export const getAll = async (req, res) => {
  try {
    const allModules = await getModules()
    return sendDataResponse(res, 200, allModules)
  } catch (e) {
    return sendDataResponse(res, 500, { error: e.message })
  }
}

export const getById = async (req, res) => {
  const moduleId = Number(req.params.id)

  try {
    const module = await getModuleById(moduleId)
    if (!module) {
      return sendDataResponse(res, 404, { error: 'Module not found' })
    }
    return sendDataResponse(res, 200, module)
  } catch (e) {
    return sendDataResponse(res, 500, { error: e.message })
  }
}
