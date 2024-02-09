import { Router } from 'express'
import { createComment } from '../controllers/comments.js'

// Error handlers
import { checkFields } from '../middleware/commentErrors.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, checkFields, createComment)

export default router
