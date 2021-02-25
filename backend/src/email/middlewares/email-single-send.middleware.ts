import type { Request, Response, NextFunction } from 'express'
import { EmailSingleSendService } from '@email/services'
import { loggerWithLabel } from '@core/logger'

const logger = loggerWithLabel(module)

async function canSendMessage(
  _: Request,
  __: Response,
  next: NextFunction
): Promise<Response | void> {
  // TODO: Rate limit if there have been >10 req/s
  return next()
}

async function sendMessage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { subject, body, from, recipient } = req.body

    EmailSingleSendService.sendSingleMessage({ subject, body, from, recipient })
    logger.info({ message: 'Sending email', action: 'sendSingleEmail' })
    return res.status(202).json({ message: 'OK' })
  } catch (err) {
    return next(err)
  }
}

export const EmailSingleSendMiddleware = {
  canSendMessage,
  sendMessage,
}
