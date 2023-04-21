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
  editComment,
  deleteCommentFromPost
} from '../controllers/comment.js'
import {
  validateAuthentication,
  validateIdOrRole,
  validateEditPostAuth,
  validateEditCommentAuth,
  validatePostAndCommentExists
} from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, create)
router.get('/', validateAuthentication, getAll)
router.post('/:id/comments', validateAuthentication, createComment)
router.post('/:id/like', validateAuthentication, likePost)
router.get('/:id', validateAuthentication, getById)
router.delete('/:id', validateAuthentication, validateIdOrRole, deletePost)
router.get('/:id/comments', validateAuthentication, getAllComments)
router.patch('/:id', validateAuthentication, validateEditPostAuth, updateById)
router.patch(
  '/:id/comments/:commentid',
  validateAuthentication,
  validateEditCommentAuth,
  editComment
)
router.delete(
  '/:id/comments/:commentid',
  validateAuthentication,
  validatePostAndCommentExists,
  validateIdOrRole,
  deleteCommentFromPost
)
export default router
