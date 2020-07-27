import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateTodoHandler')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Log API calls
  logger.info('Update a todo for current user', event)

  // DONE: Update a TODO item with the provided id using values in the "updatedTodo" object
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  // Get auth token for user
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  await updateTodo(todoId, updatedTodo, jwtToken)

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
