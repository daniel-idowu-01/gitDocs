import expressRouter from 'express'
import { authToken } from '../middleware/auth.js'
import { getAdminData } from '../controllers/admin.controller.js'

const router = expressRouter()

// adminToken
router.get('/', getAdminData)

export default router