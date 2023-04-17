import { Router } from 'express'
import { create, getById, getAll, updateById, getByRole } from '../controllers/user.js'
import { validateAuthentication, validateIdOrRole, validateTeacherRole } from '../middleware/auth.js'

const router = Router()

router.post('/', create)
router.get('/', validateAuthentication, getAll)
router.get('/:id', validateAuthentication, getById)
router.patch('/:id', validateAuthentication, validateIdOrRole, updateById)
router.get('/teachers', validateTeacherRole, validateAuthentication, getByRole)

export default router
