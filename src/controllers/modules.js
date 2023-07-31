import { createModule } from '../domain/modules.js'
import { sendDataResponse } from '../utils/responses.js'

export const addModule = async (req, res) => {
  const { moduleName, courseId } = req.body

  try {
    const resModule = await createModule(moduleName, courseId)
    return sendDataResponse(res, 201, { module: resModule })
  } catch (err) {
    // sendDataResponse(res, 400, { error: err.message })
    console.log(err)
  }
}
