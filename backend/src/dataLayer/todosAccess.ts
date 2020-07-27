import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    // private readonly userIdIndex = process.env.USER_ID_INDEX
  ) { }

  // NB: REFACTORED:
  async getAllTodos(userId: string): Promise<TodoItem[]> {
    console.log('Getting all todos')

    const result = await this.docClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': userId }
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }

  // NB: NO NEED TO REFACTOR:
  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise()

    return todoItem
  }

  // NB: REFACTORED:
  async updateTodo(todoId: string, userId: string, todoUpdate: TodoUpdate): Promise<TodoUpdate> {
    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        todoId,
        userId
      },
      UpdateExpression: 'set #n = :name, done = :done, dueDate = :dueDate',
      ExpressionAttributeValues: {
        ':name': todoUpdate.name,
        ':done': todoUpdate.done,
        ':dueDate': todoUpdate.dueDate
      },
      ExpressionAttributeNames: { '#n': 'name' },
      ReturnValues: 'UPDATED_NEW',
    }).promise()

    return todoUpdate
  }

  // NB: REFACTORED:
  async deleteTodo(todoId: string, userId: string): Promise<void> {
    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        todoId,
        userId
      }
    }).promise()
  }

  // NB: REFACTORED:
  async setAttachmentUrl(todoId: string, userId: string, attachmentUrl: string): Promise<void> {
    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        todoId,
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
