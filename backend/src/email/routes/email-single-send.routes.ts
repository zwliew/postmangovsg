import { Router } from 'express'
import { celebrate, Joi, Segments } from 'celebrate'
import { EmailSingleSendMiddleware } from '@email/middlewares'
import { fromAddressValidator } from '@core/utils/from-address'

const router = Router({ mergeParams: true })

// Validators
const sendEmailValidator = {
  [Segments.BODY]: Joi.object({
    recipient: Joi.string()
      .email()
      .options({ convert: true })
      .lowercase()
      .required(),
    subject: Joi.string().required(),
    body: Joi.string().required(),
    from: fromAddressValidator,
    // TODO: Include reply_to
  }),
}

// Routes
router.use(
  '/send',
  celebrate(sendEmailValidator),
  EmailSingleSendMiddleware.canSendMessage,
  EmailSingleSendMiddleware.sendMessage
)

export default router
