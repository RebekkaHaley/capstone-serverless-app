import * as uuid from 'uuid'

import { RecipeItem } from '../models/RecipeItem'
import { RecipeUpdate } from '../models/RecipeUpdate'

import { RecipeAccess } from '../dataLayer/recipesAccess'

import { CreateRecipeRequest } from '../requests/CreateRecipeRequest'
import { UpdateRecipeRequest } from '../requests/UpdateRecipeRequest'

import { parseUserId } from '../auth/utils'

const recipeAccess = new RecipeAccess()

export async function getAllRecipes(jwtToken: string): Promise<RecipeItem[]> {
  const userId = parseUserId(jwtToken) // Use pre-made function
  return recipeAccess.getAllRecipes(userId)
}

export async function createRecipe(createRecipeRequest: CreateRecipeRequest, jwtToken: string): Promise<RecipeItem> {
  const userId = parseUserId(jwtToken) // Use pre-made function
  const itemId = uuid.v4()

  return await recipeAccess.createRecipe({
    recipeId: itemId,
    userId: userId,
    name: createRecipeRequest.name,
    dueDate: createRecipeRequest.dueDate,
    createdAt: new Date().toISOString(),
    eaten: false
  })
}

export async function updateRecipe(recipeId: string, updateRecipeRequest: UpdateRecipeRequest, jwtToken: string): Promise<RecipeUpdate> {
  const userId = parseUserId(jwtToken) // Use pre-made function
  return await recipeAccess.updateRecipe(recipeId, userId, updateRecipeRequest)
}

export async function deleteRecipe(recipeId: string, jwtToken: string): Promise<void> {
  const userId = parseUserId(jwtToken) // Use pre-made function
  return await recipeAccess.deleteRecipe(recipeId, userId)
}

export async function setAttachmentUrl(recipeId: string, attachmentUrl: string, jwtToken: string): Promise<void> {
  const userId = parseUserId(jwtToken) // Use pre-made function
  return await recipeAccess.setAttachmentUrl(recipeId, userId, attachmentUrl)
}
