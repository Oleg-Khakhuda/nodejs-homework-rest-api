import repositoryContacts from '../../repository/contacts'
import repositoryUsers from '../../repository/users'
import { HttpCode } from '../../lib/constants'
import {
  UploadFileService,
  LocalFileStorage,
  CloudFileStorage,
} from '../../service/file-storage'
import {
  EmailService,
  SenderNodemailer,
  SenderSendgrid,
} from '../../service/email'

const aggregation = async (req, res, next) => {
  const { id } = req.params
  const data = await repositoryContacts.getStatisticsContacts(id)
  if (data) {
    return res
      .status(HttpCode.OK)
      .json({ status: 'success', code: HttpCode.OK, data })
  }
  res
    .status(HttpCode.NOT_FOUND)
    .json({ status: 'error', code: HttpCode.NOT_FOUND, message: 'Not found' })
}

const uploadAvatar = async (req, res, next) => {
  const uploadService = new UploadFileService(
    LocalFileStorage,
    req.file,
    req.user,
  )

  const avatarUrl = await uploadService.updateAvatar()

  res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data: { avatarUrl } })
}

const verifyUser = async (req, res, next) => {
  const verifyToken = req.params.verificationToken
  const userFromToken = await repositoryUsers.findByVerifyToken(verifyToken)
  if (userFromToken) {
    await repositoryUsers.updateVerify(userFromToken.id, true)
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: { message: 'Verification email sent' },
    })
  }
  res.status(HttpCode.BAD_REQUEST).json({
    status: 'error',
    code: HttpCode.BAD_REQUEST,
    data: { message: 'Verification has already been passed' },
  })
}

const repeatEmailForVerifyUser = async (req, res, next) => {
  const { email } = req.body
  const user = await repositoryUsers.findByEmail(email)
  if (user) {
    const { email, name, verificationToken } = user
    const emailService = new EmailService(
      process.env.NODE_ENV,
      new SenderSendgrid(),
    )

    const isSend = await emailService.sendVerifyEmail(
      email,
      name,
      verificationToken,
    )
    if (isSend) {
      return res
        .status(HttpCode.OK)
        .json({
          status: 'success',
          code: HttpCode.OK,
          data: { message: 'Success' },
      })
    }
    return res
      .status(HttpCode.SE)
      .json({
        status: 'error',
        code: HttpCode.SE,
        data: { message: 'missing required field email' },
    })
  }
  res
    .status(HttpCode.NOT_FOUND)
    .json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      data: { message: 'User with email not found' },
  })
}

export { aggregation, uploadAvatar, verifyUser, repeatEmailForVerifyUser }