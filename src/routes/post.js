import { Router } from 'express'
import {
  create,
  getAll,
  getById,
  updateById,
  deletePost,
  likePost
} from '../controllers/post.js'
import {
  createComment,
  getAllComments,
  likeComment
} from '../controllers/comment.js'
import {
  validateAuthentication,
  validateIdOrRole,
  validateEditPostAuth
} from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, create)
router.get('/', validateAuthentication, getAll)
router.post(
  '/:id/comments/:commentId/like',
  validateAuthentication,
  likeComment
)
router.post('/:id/comments', validateAuthentication, createComment)
router.post('/:id/like', validateAuthentication, likePost)
router.get('/:id', validateAuthentication, getById)
router.delete('/:id', validateAuthentication, validateIdOrRole, deletePost)
router.get('/:id/comments', validateAuthentication, getAllComments)
router.patch('/:id', validateAuthentication, validateEditPostAuth, updateById)

export default router
