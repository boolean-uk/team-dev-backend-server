import { Router } from 'express'
import {
  create,
  getAll,
  getById,
  deletePost,
  likePost
} from '../controllers/post.js'
import { createComment } from '../controllers/comment.js'
import { validateAuthentication, validateIdOrRole } from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, create)
router.get('/', validateAuthentication, getAll)
router.post('/:id/comments', validateAuthentication, createComment)
router.post('/:id/like', validateAuthentication, likePost)
router.get('/:id', validateAuthentication, getById)
router.delete('/:id', validateAuthentication, validateIdOrRole, deletePost)

export default router
