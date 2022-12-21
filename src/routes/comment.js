import { Router } from 'express'
import { validateAuthentication } from '../middleware/auth.js'
import { getComment } from '../controllers/comment.js'

const router = Router()

router.get('/:commentId', validateAuthentication, getComment)

export default router
