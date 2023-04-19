import { Router } from 'express'
import {
  create,
  getAll,
  getById,
  updateById,
  deletePost
} from '../controllers/post.js'
import { createComment } from '../controllers/comment.js'
import {
  validateAuthentication,
  validateIdOrRole,
  validateEditPostAuth
} from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, create)
router.get('/', validateAuthentication, getAll)
router.post('/:id/comments', validateAuthentication, createComment)
router.get('/:id', validateAuthentication, getById)
router.delete('/:id', validateAuthentication, validateIdOrRole, deletePost)
router.patch('/:id', validateAuthentication, validateEditPostAuth, updateById)

export default router
