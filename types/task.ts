export type TaskStatus = 'todo' | 'inProgress' | 'review' | 'done'
export type TaskPriority = 'high' | 'medium' | 'low'

export type Task = {
  id: string
  userId: string
  assigneeId?: string
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  dueDate?: string
  tags?: string[]
  createdAt?: string
}