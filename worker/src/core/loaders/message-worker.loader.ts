import { Worker, spawn, ModuleThread } from 'threads'
import MessageWorker from './message-worker'
import logger from '@core/logger'
import config from '@core/config'
const createMessageWorker = async (workerId: string, isLogger = false): Promise<ModuleThread<MessageWorker>> => {
  const m = new Worker('./message-worker')
  const worker = await spawn<MessageWorker>(m)
  try {
    await worker.init(workerId, isLogger)
  } catch (err){
    logger.error(`Worker died. ${err.stack}`)
    process.exit(1)
  }
  return worker
}

const messageWorkerLoader = async (): Promise<void | ModuleThread<MessageWorker>[]> => {
  let i = 1
  const workers = []
  for (; i <= config.get('messageWorker.numSender'); i++){
    workers.push(createMessageWorker(String(i)))
  }
  for (; i <=  config.get('messageWorker.numSender') + config.get('messageWorker.numLogger'); i++){
    workers.push(createMessageWorker(String(i), true))
  }
  return Promise.all(workers)
    .then((loaded) => {
      process.on('SIGINT', async function () {
        console.log('Hnadling signt')
        await loaded[0].die()
      })
      logger.info('MessageWorker loaded')
      return loaded
    })
}

process.on('SIGINT', function (){
  console.log('dont exit!')
})
export default messageWorkerLoader