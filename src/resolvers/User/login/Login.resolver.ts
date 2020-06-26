import { Resolver, Mutation, Arg, Ctx } from 'type-graphql'
import { LoginInput } from './LoginInput'
import { User } from '../../../entity/User'
import bcrypt from 'bcryptjs'
import { Context } from '../../../types/interfaces/Context'
import { issueTokens } from '../../../utils/issueTokens'

@Resolver()
export class Login {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg('input')
    { email, password: passwordAttempt }: LoginInput,
    @Ctx()
    context: Context
  ): Promise<User | undefined> {
    const { db, res } = context

    const repo = db.getRepository(User)
    const user = await repo.findOne({ where: { email } })

    if (!user) return undefined

    const passwordsMatch = await bcrypt.compare(passwordAttempt, user?.password)

    if (passwordsMatch) {
      issueTokens(user, res)
      return user
    }
    return undefined
  }
}
