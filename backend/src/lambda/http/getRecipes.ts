import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getAllRecipes } from '../../businessLogic/recipes'
import { createLogger } from '../../utils/logger'


const logger = createLogger('getRecipesHandler')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Log API calls
  logger.info('Get recipes for current user', event)

  // DONE: Get all RECIPE items

  // Get auth token for user
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const recipes = await getAllRecipes(jwtToken)

  return {
    statusCode: 200,
    body: JSON.stringify({
      items: recipes
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)
