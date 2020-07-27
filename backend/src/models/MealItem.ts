export interface MealItem {
  userId: string
  mealId: string
  createdAt: string
  name: string
  dueDate: string
  eaten: boolean
  attachmentUrl?: string
}
