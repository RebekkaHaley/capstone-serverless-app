import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

import { TodoAccess } from '../dataLayer/todosAccess'

import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

import { parseUserId } from '../auth/utils'

const todoAccess = new TodoAccess()

// NB: NO NEED TO REFACTOR:
export async function getAllTodos(jwtToken: string): Promise<TodoItem[]> {
  const userId = parseUserId(jwtToken) // Use pre-made function
  return todoAccess.getAllTodos(userId)
}

// NB: NO NEED TO REFACTOR:
export async function createTodo(createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
  const userId = parseUserId(jwtToken) // Use pre-made function
  const itemId = uuid.v4()

  return await todoAccess.createTodo({
    todoId: itemId,
    userId: userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    createdAt: new Date().toISOString(),
    done: false
  })
}

// NB: REFACTORED:
export async function updateTodo(todoId: string, updateTodoRequest: UpdateTodoRequest, jwtToken: string): Promise<TodoUpdate> {
  const userId = parseUserId(jwtToken) // Use pre-made function
  return await todoAccess.updateTodo(todoId, userId, updateTodoRequest)
}

// NB: REFACTORED:
export async function deleteTodo(todoId: string, jwtToken: string): Promise<void> {
  const userId = parseUserId(jwtToken) // Use pre-made function
  return await todoAccess.deleteTodo(todoId, userId)
}

// NB: REFACTORED:
export async function setAttachmentUrl(todoId: string, attachmentUrl: string, jwtToken: string): Promise<void> {
  const userId = parseUserId(jwtToken) // Use pre-made function
  return await todoAccess.setAttachmentUrl(todoId, userId, attachmentUrl)
}
