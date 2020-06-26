import { Context } from 'src/Context'
import { verify } from 'jsonwebtoken'
import { issueTokens } from '../utils/issueTokens'
import { User } from '../entity/User'

export const refreshTokens = async (context: Context, refreshToken: string) => {
  if (!refreshToken) return context

  try {
    if (!process.env.REFRESH_TOKEN_SECRET)
      throw new Error('REFRESH_TOKEN_SECRET missing from .env')

    const data = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as {
      user: User
    }

    const connection = context.db
    const repo = connection.getRepository(User)
    const user = await repo.findOne(data.user.id)

    // Token has been invalidated if no user was found or the count from the token doesn't match the count in the db
    if (!user || user.count !== data.user.count) return context

    // If we've gotten here, we can issue new tokens
    issueTokens(user, context.res)
    context.currentUser = user
    return context
  } catch (error) {
    console.log('Something went wrong in refreshing', { error })
    return context
  }
}
