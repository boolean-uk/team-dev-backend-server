import { Router } from 'express'
import { create, getAll, deleteById, updateById } from '../controllers/post.js'
import {
  getAllComments,
  createComment,
  deleteCommentById,
  updateComment
} from '../controllers/comment.js'
import { validateAuthentication } from '../middleware/auth.js'
import {
  createLike,
  deleteLike,
  getAllLikes,
  createCommentLike,
  deleteCommentLike
} from '../controllers/like.js'
const router = Router()

router.post('/', validateAuthentication, create)
router.get('/', validateAuthentication, getAll)
router.delete('/:id', validateAuthentication, deleteById)
router.patch('/:id', validateAuthentication, updateById)

router.get('/:id/likes', validateAuthentication, getAllLikes)
router.post('/:id/likes', validateAuthentication, createLike)
router.delete('/:postId/likes/:userId', validateAuthentication, deleteLike)

router.post('/:id/comments', validateAuthentication, createComment)
router.get('/:id/comments', validateAuthentication, getAllComments)
router.delete(
  '/:postId/comments/:commentId',
  validateAuthentication,
  deleteCommentById
)
router.patch(
  '/:postId/comments/:commentId',
  validateAuthentication,
  updateComment
)

router.post(
  '/:postId/comments/:commentId/likes',
  validateAuthentication,
  createCommentLike
)
router.delete(
  '/:postId/comments/:commentId/likes/:userId',
  validateAuthentication,
  deleteCommentLike
)

export default router
