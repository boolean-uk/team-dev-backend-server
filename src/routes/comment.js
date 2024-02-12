import { Router } from 'express'
import { createComment, getComments } from '../controllers/comment.js'
import { validateAuthentication } from '../middleware/auth.js'
import { checkFields } from '../middleware/commentErrors.js'

const router = Router()

router.get('/', validateAuthentication, getComments)
router.post(
  '/',
  validateAuthentication,
  checkFields(['postId', 'content']),
  createComment
)

export default router
