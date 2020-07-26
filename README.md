# Serverless Recipe Book

This repo is for a simple Recipe Book application using AWS Lambda and Serverless framework.

# Functionality of the application

This application will allow creating/removing/updating/fetching RECIPE items. Each RECIPE item can optionally have an attachment image. Each user only has access to RECIPE items that he/she has created.

# LOG items

The application stores RECIPE items, where each RECIPE item contains the following fields:

* `recipeId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of a RECIPE item (e.g. "Salad wrap")
* `calories` (string) - number of calories in meal
* `tried` or `liked` (boolean) - true if an item was completed, false otherwise
* `attachmentUrl` (string) - a URL pointing to an image attached to a RECIPE item
* `userId` (string) - id of a user who created a RECIPE item.

# Functions implemented

The `serverless.yml` file has the following functions:

* `Auth` - a custom authorizer for API Gateway that is added to all other functions.

* `GetRecipes` -  returns all RECIPEs for a current user. A user id can be extracted from a JWT token that is sent by the frontend.

* `CreateRecipe` - creates a new RECIPE for a current user. The shape of data sent by a client application to this function can be found in the `CreateRecipeRequest.ts` file. It receives a new RECIPE item to be created in JSON format.

* `UpdateRecipe` - updates a RECIPE item created by a current user. The shape of data sent by a client application to this function can be found in the `UpdateRecipeRequest.ts` file. It receives an object that contains three fields that can be updated in a RECIPE item. The id of an item that should be updated is passed as a URL parameter. It should return an empty body.

* `DeleteRecipe` - deletes a RECIPE item created by a current user. Expects an id of a RECIPE item to remove. It should return an empty body.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a RECIPE item. An id of a user can be extracted from a JWT token passed by a client.

# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project. The only file that you need to edit is the `config.ts` file in the `client` folder.

## Authentication

This application implements authentication via an Auth0 application. The "domain" and "client id" is copied to the `config.ts` file in the `client` folder. This project uses asymmetrically encrypted JWT tokens.

# Best practices

The following best practices suggested from the 6th lesson of the Udacity Cloud Developer Nanodegree are as follows:

## Logging

The starter code comes with a configured [Winston](https://github.com/winstonjs/winston) logger that creates [JSON formatted](https://stackify.com/what-is-structured-logging-and-why-developers-need-it/) log statements. It can write log messages like this:

```ts
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')

// You can provide additional information with every log statement
// This information can then be used to search for log statements in a log storage system
logger.info('User was authorized', {
  // Additional information stored with a log statement
  key: 'value'
})
```

## Local Secondary Index

To store RECIPE items, a DynamoDB table with local secondary index(es) has been used.

```yml

RecipesTable:
  Type: AWS::DynamoDB::Table
  Properties:
    AttributeDefinitions:
      - AttributeName: partitionKey
        AttributeType: S
      - AttributeName: sortKey
        AttributeType: S
      - AttributeName: indexKey
        AttributeType: S
    KeySchema:
      - AttributeName: partitionKey
        KeyType: HASH
      - AttributeName: sortKey
        KeyType: RANGE
    BillingMode: PAY_PER_REQUEST
    TableName: ${self:provider.environment.RECIPES_TABLE}
    LocalSecondaryIndexes:
      - IndexName: ${self:provider.environment.INDEX_NAME}
        KeySchema:
          - AttributeName: partitionKey
            KeyType: HASH
          - AttributeName: indexKey
            KeyType: RANGE
        Projection:
          ProjectionType: ALL # What attributes will be copied to an index

```

## Using Query()

The `query()` method is used to query an index as follows:

```ts
await this.dynamoDBClient
  .query({
    TableName: 'table-name',
    IndexName: 'index-name',
    KeyConditionExpression: 'paritionKey = :paritionKey',
    ExpressionAttributeValues: {
      ':paritionKey': partitionKeyValue
    }
  })
  .promise()
```

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

# Postman collection

There is a provided Postman collection that contains sample requests in this project.