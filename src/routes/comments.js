import { Router } from 'express'
import { createComment } from '../controllers/comments.js'

// Error handlers
import { checkFields } from '../middleware/commentErrors.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.post(
  '/',
  validateAuthentication,
  checkFields(['postId', 'content']),
  createComment
)

export default router
