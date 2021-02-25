import type { Request, Response, NextFunction } from 'express'
import { SmsService } from '@sms/services'
import { loggerWithLabel } from '@core/logger'

const logger = loggerWithLabel(module)

async function canSendMessage(_: Request, __: Response, next: NextFunction) {
  // TOOD: Rate limit based on credentials
  return next()
}

async function sendSingleMessage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { recipient, body } = req.body
    const { credentials } = res.locals

    await SmsService.sendMessage(credentials, recipient, body)
    logger.info({ message: 'Sending SMS', action: 'sendSingleSms' })
    return res.status(202).json({ message: 'OK' })
  } catch (err) {
    return next(err)
  }
}

export const SmsSingleSendMiddleware = {
  canSendMessage,
  sendSingleMessage,
}
