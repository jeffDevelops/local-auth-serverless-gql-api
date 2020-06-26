import { Context } from '../types/interfaces/Context'
import { verify } from 'jsonwebtoken'
import { refreshTokens } from './refreshTokens'
import { User } from 'src/entity/User'
import { parseCookie } from '../utils/parseCookie'

export const verifyAccessToken = async (context: Context) => {
  // Note: Vercel's req.cookies bork the cookie value; get from headers instead
  if (!context.req.headers.cookie) return context

  // Parse the access token cookie
  const accessToken = parseCookie('accessToken', context.req.headers.cookie)
  const refreshToken = parseCookie('refreshToken', context.req.headers.cookie)

  // If there are no tokens to verify, the user is unauthenticated--don't assign context property
  if (!refreshToken && !accessToken) {
    return context
  }

  // Verify the accessToken
  if (accessToken) {
    try {
      if (!process.env.ACCESS_TOKEN_SECRET)
        throw new Error('ACCESS_TOKEN_SECRET missing from .env')

      const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as {
        user: User
      }
      context.currentUser = data.user
      return context
    } catch (error) {
      if (refreshToken) {
        return refreshTokens(context, refreshToken)
      }

      return context
    }
  } else if (refreshToken) {
    return refreshTokens(context, refreshToken)
  }

  // No tokens, user not logged in
  return context
}
