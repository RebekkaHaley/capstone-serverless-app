export interface RecipeItem {
  userId: string
  recipeId: string
  createdAt: string
  name: string
  dueDate: string
  eaten: boolean
  attachmentUrl?: string
}
