import { Router } from 'express'
import { validateAuthentication } from '../middleware/auth.js'
import { getComments } from '../controllers/comment.js'

const router = Router()

router.get('/getComments', validateAuthentication, getComments)

export default router
