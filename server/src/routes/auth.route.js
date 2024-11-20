import expressRouter from 'express'
import { authToken } from '../middleware/authToken.js'
import { createUser, login, changePassword, confirmEmail } from '../controllers/auth.controller.js'

const router = expressRouter()

router.post('/', createUser)
router.post('/login', login)
router.put('/change-password', authToken, changePassword)
router.get('/confirm-email/:emailToken', confirmEmail)

export default router