/**
 * Fields in a request to update a single RECIPE item.
 */
export interface UpdateRecipeRequest {
  name: string
  dueDate: string
  done: boolean
}
