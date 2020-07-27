export interface RecipeItem {
  userId: string
  recipeId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
