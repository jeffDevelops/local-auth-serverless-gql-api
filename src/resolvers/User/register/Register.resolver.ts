import { Resolver, Mutation, Arg, Ctx } from 'type-graphql'
import { UserRegistrationInput } from './RegisterInput'
import bcrypt from 'bcryptjs'
import { User } from '../../../entity/User'
import { Context } from '../../../types/interfaces/Context'

@Resolver()
export class Register {
  @Mutation(() => User!)
  async register(
    @Ctx() { db }: Context,
    @Arg('input')
    { firstName, lastName, email, password }: UserRegistrationInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10)
    const repo = db.getRepository(User)

    // Create the user
    const user = repo.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    })

    await repo.save(user)

    return user
  }
}
