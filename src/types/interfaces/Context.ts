import { NowRequest, NowResponse } from '@now/node'
import { Connection } from 'typeorm'
import { User } from '../../entity/User'

export interface Context {
  req: NowRequest
  res: NowResponse
  db: Connection
  currentUser?: User

  init(): Promise<Context>
}
