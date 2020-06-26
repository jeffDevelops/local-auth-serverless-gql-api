import { sign } from 'jsonwebtoken'
import { User } from '../entity/User'
import { NowResponse } from '@now/node'

export const issueTokens = (user: User, res: NowResponse) => {
  if (!process.env.ACCESS_TOKEN_SECRET)
    throw new Error(
      'No ACCESS_TOKEN_SECRET accessible in environment variables.'
    )

  if (!process.env.REFRESH_TOKEN_SECRET)
    throw new Error(
      'No REFRESH_TOKEN_SECRET accessible in environment variables.'
    )

  const accessToken = sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '10s',
    // expiresIn: '1min',
  })

  const refreshToken = sign({ user }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '30s',
    // expiresIn: '7d',
  })

  res.setHeader('Set-Cookie', [
    `accessToken="${accessToken}; Max-Age=${10}; HttpOnly;`,
    // `accessToken="${accessToken}; Max-Age=${60}; HttpOnly;`,
    `refreshToken="${refreshToken}; Max-Age=${30}; HttpOnly;`,
    // `refreshToken="${refreshToken}; Max-Age=${60 * 60 * 24 * 7}; HttpOnly;`,
  ])
}
