import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import v1Router from '../routes'

const expressApp = ({ app }: {app: express.Application}): void => {
  app.use(bodyParser.json())
  app.get('/', async (_req: Request, res: Response) => {
    res.sendStatus(200).json({ message: 'ok' })
  })
  app.use('/v1', v1Router)
}

export default expressApp