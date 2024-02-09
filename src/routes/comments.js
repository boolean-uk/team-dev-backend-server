import { Router } from 'express'
import { createComment } from '../controllers/comments.js'

// Error handlers
import { checkFields } from '../middleware/commentErrors.js'

const router = Router()

router.post('/', checkFields, createComment)

export default router
