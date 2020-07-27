import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { deleteRecipe } from '../../businessLogic/recipes'
import { createLogger } from '../../utils/logger'


const logger = createLogger('deleteRecipeHandler')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Log API calls
  logger.info('Delete a recipe for current user', event)

  // DONE: Remove a RECIPE item by id
  const recipeId = event.pathParameters.recipeId

  // Get auth token for user
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  await deleteRecipe(recipeId, jwtToken)

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
