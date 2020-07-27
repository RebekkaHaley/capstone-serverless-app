import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { RecipeItem } from '../models/RecipeItem'
import { RecipeUpdate } from '../models/RecipeUpdate'

export class RecipeAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly recipesTable = process.env.RECIPES_TABLE,
    // private readonly userIdIndex = process.env.USER_ID_INDEX
  ) { }

  async getAllRecipes(userId: string): Promise<RecipeItem[]> {
    console.log('Getting all recipes')

    const result = await this.docClient.query({
      TableName: this.recipesTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': userId }
    }).promise()

    const items = result.Items
    return items as RecipeItem[]
  }

  async createRecipe(recipeItem: RecipeItem): Promise<RecipeItem> {
    await this.docClient.put({
      TableName: this.recipesTable,
      Item: recipeItem
    }).promise()

    return recipeItem
  }

  async updateRecipe(recipeId: string, userId: string, recipeUpdate: RecipeUpdate): Promise<RecipeUpdate> {
    await this.docClient.update({
      TableName: this.recipesTable,
      Key: {
        recipeId,
        userId
      },
      UpdateExpression: 'set #n = :name, done = :done, dueDate = :dueDate',
      ExpressionAttributeValues: {
        ':name': recipeUpdate.name,
        ':done': recipeUpdate.done,
        ':dueDate': recipeUpdate.dueDate
      },
      ExpressionAttributeNames: { '#n': 'name' },
      ReturnValues: 'UPDATED_NEW',
    }).promise()

    return recipeUpdate
  }

  async deleteRecipe(recipeId: string, userId: string): Promise<void> {
    await this.docClient.delete({
      TableName: this.recipesTable,
      Key: {
        recipeId,
        userId
      }
    }).promise()
  }

  async setAttachmentUrl(recipeId: string, userId: string, attachmentUrl: string): Promise<void> {
    await this.docClient.update({
      TableName: this.recipesTable,
      Key: {
        recipeId,
        userId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      },
      ReturnValues: 'UPDATED_NEW'
    }).promise()
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
