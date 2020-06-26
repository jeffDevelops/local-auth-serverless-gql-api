import { NowRequest, NowResponse } from '@now/node'
import { Connection } from 'typeorm'
import { Context as ContextInterface } from './types/interfaces/Context'
import { Database } from './Database'
import { RequiresEnvVars } from './decorators/requiresEnvVar'
import { verifyAccessToken } from './middleware/verifyAccessToken'
import { User } from './entity/User'

@RequiresEnvVars(['ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET'])
export class Context implements ContextInterface {
  req: NowRequest
  res: NowResponse
  db: Connection
  currentUser?: User

  constructor(req: NowRequest, res: NowResponse) {
    this.req = req
    this.res = res
  }

  async init() {
    // Establish database connection
    const db = new Database()
    this.db = await db.getConnection()

    return await verifyAccessToken(this)
  }
}
