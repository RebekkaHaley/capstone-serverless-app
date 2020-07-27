import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { deleteTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'


const logger = createLogger('deleteTodoHandler')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Log API calls
  logger.info('Delete a todo for current user', event)

  // DONE: Remove a TODO item by id
  const todoId = event.pathParameters.todoId

  // Get auth token for user
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  await deleteTodo(todoId, jwtToken)

  return {
    statusCode: 204,
    body: ''
  }
})

handler.use(
  cors({
    credentials: true
  })
)
