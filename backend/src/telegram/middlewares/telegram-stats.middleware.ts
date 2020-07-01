import { Request, Response, NextFunction } from 'express'
import { TelegramStatsService } from '@telegram/services'
/**
 * Gets stats for sms campaign
 * @param req
 * @param res
 * @param next
 */
const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { campaignId } = req.params
  try {
    const stats = await TelegramStatsService.getStats(+campaignId)
    return res.json(stats)
  } catch (err) {
    next(err)
  }
}

/**
 * Gets invalid recipients for sms campaign
 * @param req
 * @param res
 * @param next
 */
const getFailedRecipients = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { campaignId } = req.params
  try {
    const recipients = await TelegramStatsService.getFailedRecipients(
      +campaignId
    )
    return res.json(recipients)
  } catch (err) {
    next(err)
  }
}

export const TelegramStatsMiddleware = {
  getStats,
  getFailedRecipients,
}
