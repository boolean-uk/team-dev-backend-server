import { createModule } from '../domain/modules.js'
import { sendDataResponse } from '../utils/responses.js'

export const addModule = async (req, res) => {
  const { module } = req.body

  try {
    const resModule = await createModule(module)
    return sendDataResponse(res, 201, { module: resModule })
  } catch (err) {
    // sendDataResponse(res, 400, { error: err.message })
    console.log(err)
  }
}
