import { Router } from 'express'
import { celebrate, Joi, Segments } from 'celebrate'
import { SmsMiddleware, SmsSingleSendMiddleware } from '@sms/middlewares'

const router = Router({ mergeParams: true })

// Validators
const sendSingleValidator = {
  [Segments.BODY]: {
    body: Joi.string().required(),
    recipient: Joi.string().trim().required(),
    // TODO: Accept actual Twilio credentials
    label: Joi.string().required(),
  },
}

// Routes
router.post(
  '/send',
  celebrate(sendSingleValidator),
  SmsMiddleware.getCredentialsFromLabel,
  SmsSingleSendMiddleware.canSendMessage,
  SmsSingleSendMiddleware.sendSingleMessage
)

export default router
