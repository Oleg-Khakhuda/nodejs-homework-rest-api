import { Router } from 'express'
import { registration, login, logout, currentUser, updateSubscription } from '../../../controllers/auth'
import guard from '../../../middlewares/guard'
import { validateAuth, validateUpdateSubscription } from './validate'
import limiter from '../../../middlewares/rate-limit'

const router = new Router()

router.post('/signup', validateAuth, limiter(15 *60 * 1000, 2), registration)
router.post('/login', validateAuth, login)
router.post('/logout', guard, logout)
router.get('/current', guard, currentUser)
router.patch('/', guard, validateUpdateSubscription, updateSubscription)

export default router
