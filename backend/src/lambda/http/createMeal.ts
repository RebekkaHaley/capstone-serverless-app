import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { CreateRecipeRequest } from '../../requests/CreateRecipeRequest'
import { createRecipe } from '../../businessLogic/recipes'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createRecipeHandler')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Log API calls
  logger.info('Create a recipe for current user', event)

  // DONE: Implement creating a new RECIPE item
  const newRecipe: CreateRecipeRequest = JSON.parse(event.body)

  // Get auth token for user
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const newItem = await createRecipe(newRecipe, jwtToken)

  return {
    statusCode: 201,
    body: JSON.stringify({
      item: newItem
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)
