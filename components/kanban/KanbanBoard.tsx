'use client'
import { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import TaskModal from './TaskModal'
import TaskDetailModal from './TaskDetailModal'

const COLUMNS = [
  { id: 'todo', label: 'TO DO', color: '#555', bg: '#f8f9fa', headerBg: '#f0f1f3', dot: '#999' },
  { id: 'inProgress', label: 'IN PROGRESS', color: '#e65100', bg: '#fffdf9', headerBg: '#fff3e0', dot: '#ff9800' },
  { id: 'review', label: 'REVIEW', color: '#1565c0', bg: '#f8fbff', headerBg: '#e3f2fd', dot: '#2196f3' },
  { id: 'done', label: 'DONE', color: '#2e7d32', bg: '#f8fdf8', headerBg: '#e8f5e9', dot: '#4caf50' },
]

const PRIORITY_STYLE: any = {
  high: { background: '#fce4e4', color: '#c62828', label: '🔴 High' },
  medium: { background: '#fff8e1', color: '#f57f17', label: '🟡 Medium' },
  low: { background: '#e8f5e9', color: '#2e7d32', label: '🟢 Low' },
}

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<any[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)

  const fetchTasks = () => {
    fetch('http://localhost:3001/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data))
  }

  useEffect(() => { fetchTasks() }, [])

  const getTasksByStatus = (status: string) =>
    tasks.filter((t) => t.status === status)

  const handleDeleteTask = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.confirm('Delete this task?')) return
    await fetch(`http://localhost:3001/tasks/${taskId}`, { method: 'DELETE' })
    fetchTasks()
  }

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId) return

    // Update task status locally first (optimistic update)
    const updatedTasks = tasks.map((task) =>
      task.id === draggableId
        ? { ...task, status: destination.droppableId }
        : task
    )
    setTasks(updatedTasks)

    // Update in JSON Server
    const task = tasks.find((t) => t.id === draggableId)
    await fetch(`http://localhost:3001/tasks/${draggableId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...task, status: destination.droppableId }),
    })
  }

  return (
    <div style={{ height: '100%', fontFamily: 'Segoe UI, sans-serif' }}>

      {showAddModal && (
        <TaskModal onClose={() => setShowAddModal(false)} onTaskAdded={fetchTasks} />
      )}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskUpdated={fetchTasks}
        />
      )}

      {/* Board Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '20px', margin: '0 0 2px' }}>Kanban Board</h2>
          <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>{tasks.length} tasks · Drag cards to move between columns</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{ background: '#1a1a2e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'background 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#6c63ff'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#1a1a2e'}
        >
          + Add Task
        </button>
      </div>

      {/* Drag Drop Context */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', height: 'calc(100vh - 220px)' }}>
          {COLUMNS.map((col) => {
            const colTasks = getTasksByStatus(col.id)
            return (
              <div key={col.id} style={{ background: col.bg, borderRadius: '14px', border: '1px solid #e8eaed', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>

                {/* Column Header */}
                <div style={{ padding: '14px 16px', background: col.headerBg, borderBottom: '1px solid #e8eaed', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.dot }} />
                    <span style={{ fontSize: '11px', fontWeight: '700', color: col.color, letterSpacing: '0.06em' }}>{col.label}</span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '700', background: 'white', color: col.color, padding: '2px 8px', borderRadius: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}>
                    {colTasks.length}
                  </span>
                </div>

                {/* Droppable area */}
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        overflowY: 'auto',
                        flex: 1,
                        background: snapshot.isDraggingOver ? col.headerBg : 'transparent',
                        transition: 'background 0.2s',
                      }}
                    >
                      {colTasks.length === 0 && !snapshot.isDraggingOver && (
                        <div style={{ textAlign: 'center', color: '#ccc', fontSize: '12px', padding: '24px 0' }}>
                          Drop tasks here
                        </div>
                      )}

                      {colTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => setSelectedTask(task)}
                              style={{
                                background: 'white',
                                border: '1px solid #e8eaed',
                                borderRadius: '10px',
                                padding: '14px',
                                cursor: 'grab',
                                boxShadow: snapshot.isDragging
                                  ? '0 8px 24px rgba(0,0,0,0.15)'
                                  : '0 1px 4px rgba(0,0,0,0.05)',
                                position: 'relative',
                                transform: snapshot.isDragging ? 'rotate(2deg)' : 'none',
                                transition: 'box-shadow 0.15s',
                                ...provided.draggableProps.style,
                              }}
                            >
                              {/* Delete btn */}
                              <button
                                onClick={(e) => handleDeleteTask(task.id, e)}
                                style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#ddd', fontSize: '16px', lineHeight: 1, padding: '2px', transition: 'color 0.15s' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#e53935'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#ddd'}
                              >
                                ✕
                              </button>

                              {/* Title */}
                              <p style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a2e', margin: '0 0 10px', paddingRight: '20px', lineHeight: '1.4' }}>
                                {task.title}
                              </p>

                              {/* Tags */}
                              {task.tags && task.tags.length > 0 && (
                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                  {task.tags.map((tag: string) => (
                                    <span key={tag} style={{ fontSize: '10px', background: '#f0f0ff', color: '#6c63ff', padding: '2px 6px', borderRadius: '4px', fontWeight: '500' }}>
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Priority + Date */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '5px', ...PRIORITY_STYLE[task.priority] }}>
                                  {PRIORITY_STYLE[task.priority]?.label || task.priority}
                                </span>
                                {task.dueDate && (
                                  <span style={{ fontSize: '11px', color: '#aaa' }}>📅 {task.dueDate}</span>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {/* Add card */}
                      <button
                        onClick={() => setShowAddModal(true)}
                        style={{ width: '100%', border: '1.5px dashed #d0d0d0', background: 'transparent', borderRadius: '10px', padding: '10px', color: '#bbb', cursor: 'pointer', fontSize: '12px', transition: 'all 0.15s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#6c63ff'; e.currentTarget.style.color = '#6c63ff' }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d0d0d0'; e.currentTarget.style.color = '#bbb' }}
                      >
                        + Add card
                      </button>
                    </div>
                  )}
                </Droppable>
              </div>
            )
          })}
        </div>
      </DragDropContext>
    </div>
  )
}