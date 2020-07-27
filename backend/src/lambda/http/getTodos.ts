import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getAllTodos } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'


const logger = createLogger('getTodosHandler')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Log API calls
  logger.info('Get todos for current user', event)

  // DONE: Get a single TODO item

  // Get auth token for user
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const todos = await getAllTodos(jwtToken)

  return {
    statusCode: 200,
    body: JSON.stringify({
      items: todos
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)
