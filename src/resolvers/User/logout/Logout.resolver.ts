import { Resolver, Ctx, Mutation } from 'type-graphql'
import { Context } from '../../../types/interfaces/Context'
import { User } from '../../../entity/User'

@Resolver()
export class Logout {
  @Mutation(() => Boolean, { name: 'logout' })
  async invalidateTokens(
    @Ctx() { db, currentUser }: Context
  ): Promise<boolean> {
    if (!currentUser) {
      return true
    }

    const userRepository = db.getRepository(User)
    await userRepository.save({
      id: currentUser.id,
      count: currentUser.count + 1,
    })
    return true
  }
}
