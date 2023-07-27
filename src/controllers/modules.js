import { createModule } from '../domain/modules'
import { sendDataResponse } from '../utils/responses'

export const addModule = async (req, res) => {
  const { module } = req.body

  try {
    createModule(module)
  } catch (err) {
    sendDataResponse(res, 400, { error: err.message })
  }
}
