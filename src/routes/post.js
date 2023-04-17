import { Router } from 'express'
import { create, getAll } from '../controllers/post.js'
import { validateAuthentication } from '../middleware/auth.js'
import { updateById } from '../controllers/post.js'
const router = Router()

router.post('/', validateAuthentication, create)
router.get('/', validateAuthentication, getAll)

router.patch('/:id', validateAuthentication, updateById)

export default router
