import { Resolver, Query, Arg, Ctx } from 'type-graphql'
import { UserExistsInput } from './UserExistsInput'
import { Context } from '../../../types/interfaces/Context'
import { User } from '../../../entity/User'

@Resolver()
export class UserExists {
  @Query(() => Boolean!)
  async userExists(
    @Ctx() { db }: Context,
    @Arg('input') { email }: UserExistsInput
  ): Promise<boolean> {
    const repo = db.getRepository(User)
    const user = await repo.findOne({ email })
    return !!user
  }
}
