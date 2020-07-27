import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { UpdateRecipeRequest } from '../../requests/UpdateRecipeRequest'
import { updateRecipe } from '../../businessLogic/recipes'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateRecipeHandler')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Log API calls
  logger.info('Update a recipe for current user', event)

  // DONE: Update a RECIPE item with the provided id using values in the "updatedRecipe" object
  const recipeId = event.pathParameters.recipeId
  const updatedRecipe: UpdateRecipeRequest = JSON.parse(event.body)

  // Get auth token for user
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  await updateRecipe(recipeId, updatedRecipe, jwtToken)

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
