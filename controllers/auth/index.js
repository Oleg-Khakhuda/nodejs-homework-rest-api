import { HttpCode } from '../../lib/constants'
import authService from '../../service/auth'
import {
  EmailService,
  SenderNodemailer,
  SenderSendgrid,
} from '../../service/email'
import { CustomError } from '../../lib/custom-error'

const registration = async (req, res, next) => {
  try {
    const { email } = req.body
    const isUserExist = await authService.isUserExist(email)
    if (isUserExist) {
        throw new CustomError(HttpCode.CONFLICT, 'Email is already exist')
    }
    const userData = await authService.create(req.body)
    const emailService = new EmailService(
      process.env.NODE_ENV,
      new SenderSendgrid(),
    )
    
    const isSend = await emailService.sendVerifyEmail(
      email,
      userData.name,
      userData.verificationToken,
    )
    delete userData.verificationToken

    res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {... userData, isSendEmailVerify: isSend}
    })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
    const { email, password } = req.body
    const user = await authService.getUser(email, password)
    if (!user) {
        throw new CustomError(HttpCode.UNAUTHORIZED, 'Invalid credentials')
    }
    const token = authService.getToken(user)
    await authService.setToken(user.id, token)
    res.status(HttpCode.OK).json({ status: 'success', code: HttpCode.OK, data: { token } })
}

const logout = async (req, res, next) => {
    await authService.setToken(req.user.id, null)
    res.status(HttpCode.NO_CONTENT).json({ status: 'success', code: HttpCode.OK, data: {} })
}

const currentUser = async (req, res, next) => {
  const { email, subscription } = req.user
 res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    data: { email, subscription },
  })
  }

const updateSubscription = async (req, res, next) => {
  const { email, id } = req.user
  const { subscription } = req.body
  await authService.setSubscription(id, subscription)

  res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    data: { email, subscription },
  })
}

export {registration, login, logout, currentUser, updateSubscription}