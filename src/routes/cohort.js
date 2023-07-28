
import { create, getAll, get, addUser } from '../controllers/cohort.js'

import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, validateTeacherRole, create)
router.post('/user/add', validateAuthentication, validateTeacherRole, addUser)

router.get('/:id', validateAuthentication, get)
router.get('/', validateAuthentication, validateTeacherRole, getAll)

export default router
