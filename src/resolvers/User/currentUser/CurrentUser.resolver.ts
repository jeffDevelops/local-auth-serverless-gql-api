import { Resolver, Query, Ctx } from 'type-graphql'

import { User } from '../../../entity/User'
import { Context } from '../../../types/interfaces/Context'

@Resolver()
export class CurrentUser {
  @Query(() => User, { nullable: true })
  async currentUser(
    @Ctx() { db, currentUser }: Context
  ): Promise<User | undefined> {
    if (!currentUser) {
      return undefined
    }

    const repo = db.getRepository(User)
    const user = await repo.findOne(currentUser.id)
    return user
  }
}
