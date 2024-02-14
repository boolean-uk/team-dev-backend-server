import { Router } from 'express'
import {
  createComment,
  getComments,
  getCommentsByPost
} from '../controllers/comment.js'
import { validateAuthentication } from '../middleware/auth.js'
import { checkFields, checkPostExist } from '../middleware/commentErrors.js'

const router = Router()

router.get('/', validateAuthentication, getComments)
router.post(
  '/',
  validateAuthentication,
  checkFields(['postId', 'content']),
  createComment
)
router.get('/:postId', checkPostExist, getCommentsByPost)

export default router
