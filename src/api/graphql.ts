import 'reflect-metadata'
import { config as env } from 'dotenv'
import { ApolloServer } from 'apollo-server-micro'
import { buildSchema } from 'type-graphql'
import * as resolvers from '../resolvers'
import { Context } from '../Context'
import microCors from 'micro-cors'
import { IncomingMessage, ServerResponse } from 'http'

const cors = microCors({
  allowCredentials: true,
})

env() // Read in environment variables

export const config = {
  api: {
    bodyParser: false,
  },
}

export default cors(async (req: IncomingMessage, res: ServerResponse) => {
  const schema = await buildSchema({
    resolvers: Object.values(resolvers),
    // authChecker,
  })

  const server = new ApolloServer({
    introspection: true,
    playground: {
      settings: {
        'editor.theme': 'light',
        'request.credentials': 'include',
        // 'schema.polling.interval': 60000, // there's a GH issue out for this
      },
    },
    context: async ({ req, res }: Context) => {
      console.log('initializing context ')
      return await new Context(req, res).init()
    },
    schema,
    // formatError: error => formatError(error),
  })

  const allowedOrigins = [
    'http://localhost:3000',
    'https://budgie-web.vercel.app',
  ]

  if (req.headers.origin && allowedOrigins.includes(req.headers.origin)) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Headers', [
    'apollographql-client-name',
    'content-type',
  ])

  if (req.method === 'OPTIONS') {
    return res.end()
  }

  return server.createHandler({
    path: '/graphql',
  })(req, res)
})
