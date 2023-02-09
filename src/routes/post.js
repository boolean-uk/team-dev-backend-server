import { Router } from 'express'
import { create, getAll, deleteById, updateById } from '../controllers/post.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, create)
router.get('/', validateAuthentication, getAll)
router.delete('/:id', validateAuthentication, deleteById)
router.patch('/:id', validateAuthentication, updateById)

router.get('/:id/comments', validateAuthentication, getAll)

export default router
