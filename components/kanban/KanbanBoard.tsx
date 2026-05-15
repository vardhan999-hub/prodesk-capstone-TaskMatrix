'use client'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import { Task, TaskStatus } from '@/types/task'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import TaskModal from './TaskModal'
import TaskDetailModal from './TaskDetailModal'

const COLUMNS = [
  { id: 'todo', label: 'TO DO', color: '#555', bg: '#f8f9fa', headerBg: '#f0f1f3', dot: '#999' },
  { id: 'inProgress', label: 'IN PROGRESS', color: '#e65100', bg: '#fffdf9', headerBg: '#fff3e0', dot: '#ff9800' },
  { id: 'review', label: 'REVIEW', color: '#1565c0', bg: '#f8fbff', headerBg: '#e3f2fd', dot: '#2196f3' },
  { id: 'done', label: 'DONE', color: '#2e7d32', bg: '#f8fdf8', headerBg: '#e8f5e9', dot: '#4caf50' },
]

const PRIORITY_STYLE: Record<string, { background: string; color: string; label: string }> = {
  high: { background: '#fce4e4', color: '#c62828', label: '🔴 High' },
  medium: { background: '#fff8e1', color: '#f57f17', label: '🟡 Medium' },
  low: { background: '#e8f5e9', color: '#2e7d32', label: '🟢 Low' },
}

const CHART_COLORS = ['#6c63ff', '#ff9800', '#2196f3', '#4caf50']

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const { user } = useAuthStore()

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }, [])

  const fetchTasks = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('userId', user.id)
      .order('createdAt', { ascending: false })
    if (error) console.error('Error fetching tasks:', error)
    else setTasks(data as Task[] || [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    if (!user) return
    fetchTasks()
    const channel = supabase
      .channel('tasks-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `userId=eq.${user.id}`,
      }, () => fetchTasks())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user, fetchTasks])

  const getTasksByStatus = useCallback((status: string) =>
    tasks.filter((t) => t.status === status), [tasks])

  const handleDeleteTask = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.confirm('Delete this task?')) return
    setTasks(prev => prev.filter(task => task.id !== taskId))
    const { error } = await supabase.from('tasks').delete().eq('id', taskId)
    if (error) { console.error('Error deleting task:', error); fetchTasks(); showToast('❌ Failed to delete task') }
    else showToast('🗑 Task deleted')
  }

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return
    const { source, destination, draggableId } = result
    if (source.droppableId === destination.droppableId && source.index === destination.index) return
    setTasks(prev => prev.map((task) =>
      task.id === draggableId ? { ...task, status: destination.droppableId as TaskStatus } : task
    ))
    const { error } = await supabase.from('tasks').update({ status: destination.droppableId }).eq('id', draggableId)
    if (error) { console.error('Drag update error:', error); fetchTasks() }
  }

  // Analytics
  const statusData = COLUMNS.map((col) => ({
    name: col.label,
    value: tasks.reduce((acc, t) => t.status === col.id ? acc + 1 : acc, 0),
  }))

  const priorityData = (['high', 'medium', 'low'] as const).map((p) => ({
    name: p.charAt(0).toUpperCase() + p.slice(1),
    count: tasks.reduce((acc, t) => t.priority === p ? acc + 1 : acc, 0),
  }))

  const completionRate = tasks.length > 0
    ? Math.round((tasks.filter((t) => t.status === 'done').length / tasks.length) * 100)
    : 0

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div style={{ height: '100%', fontFamily: 'Segoe UI, sans-serif' }}>

        {/* Toast */}
        {toast && (
          <div style={{ position: 'fixed', top: '16px', right: '16px', background: '#1a1a2e', color: 'white', padding: '12px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
            {toast}
          </div>
        )}

        {showAddModal && (
          <TaskModal onClose={() => setShowAddModal(false)} onTaskAdded={() => { fetchTasks(); showToast('✅ Task created!') }} />
        )}
        {selectedTask && (
          <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} onTaskUpdated={() => { fetchTasks(); showToast('✅ Task updated!') }} />
        )}

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontWeight: 700, color: '#1a1a2e', fontSize: '20px', margin: '0 0 2px' }}>Kanban Board</h2>
            <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>{tasks.length} tasks · Your personal board</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setShowAnalytics(!showAnalytics)}
              style={{ background: showAnalytics ? '#6c63ff' : 'white', color: showAnalytics ? 'white' : '#1a1a2e', border: '1.5px solid #e8eaed', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              {showAnalytics ? 'Hide Analytics' : '📊 Analytics'}
            </button>
            <button onClick={() => setShowAddModal(true)}
              style={{ background: '#1a1a2e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#6c63ff'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#1a1a2e'}>
              + Add Task
            </button>
          </div>
        </div>

        {/* ANALYTICS PANEL */}
        {showAnalytics && (
          <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e8eaed', padding: '24px', marginBottom: '20px' }}>
            <h3 style={{ fontWeight: 700, color: '#1a1a2e', fontSize: '16px', margin: '0 0 20px' }}>📊 Project Analytics</h3>
            {tasks.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#aaa', padding: '40px 0', fontSize: '14px' }}>
                No analytics available yet. Add tasks to see insights!
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
                  {[
                    { label: 'Total Tasks', value: tasks.length, color: '#6c63ff', bg: '#f0f0ff' },
                    { label: 'Completed', value: tasks.filter(t => t.status === 'done').length, color: '#2e7d32', bg: '#e8f5e9' },
                    { label: 'In Progress', value: tasks.filter(t => t.status === 'inProgress').length, color: '#e65100', bg: '#fff3e0' },
                    { label: 'Completion Rate', value: completionRate + '%', color: '#1565c0', bg: '#e3f2fd' },
                  ].map((stat) => (
                    <div key={stat.label} style={{ background: stat.bg, borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '28px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                      <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <h4 style={{ fontWeight: 600, color: '#1a1a2e', fontSize: '13px', margin: '0 0 12px', textTransform: 'uppercase' }}>Tasks by Status</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}>
                          {statusData.map((_, index) => <Cell key={index} fill={CHART_COLORS[index]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 600, color: '#1a1a2e', fontSize: '13px', margin: '0 0 12px', textTransform: 'uppercase' }}>Tasks by Priority</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={priorityData}>
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#6c63ff" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid #e8eaed', borderTop: '3px solid #6c63ff', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
              <p style={{ color: '#aaa', fontSize: '13px' }}>Loading your tasks...</p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', height: showAnalytics ? 'calc(100vh - 520px)' : 'calc(100vh - 220px)' }}>
            {COLUMNS.map((col) => {
              const colTasks = getTasksByStatus(col.id)
              return (
                <Droppable droppableId={col.id} key={col.id}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}
                      style={{ background: col.bg, borderRadius: '14px', border: '1px solid #e8eaed', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                      <div style={{ padding: '14px 16px', background: col.headerBg, borderBottom: '1px solid #e8eaed', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.dot }} />
                          <span style={{ fontSize: '11px', fontWeight: 700, color: col.color, letterSpacing: '0.06em' }}>{col.label}</span>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 700, background: 'white', color: col.color, padding: '2px 8px', borderRadius: '10px' }}>
                          {colTasks.length}
                        </span>
                      </div>

                      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flex: 1 }}>
                        {colTasks.length === 0 && (
                          <div style={{ textAlign: 'center', color: '#ccc', fontSize: '12px', padding: '24px 0' }}>Drop tasks here</div>
                        )}

                        {colTasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                            {(provided, snapshot) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                onClick={() => setSelectedTask(task)}
                                style={{ background: 'white', border: '1px solid #e8eaed', borderRadius: '10px', padding: '14px', cursor: 'pointer', position: 'relative', transition: 'all 0.15s', boxShadow: snapshot.isDragging ? '0 8px 20px rgba(0,0,0,0.15)' : 'none', ...provided.draggableProps.style }}
                                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}>

                                <button onClick={(e) => handleDeleteTask(task.id, e)}
                                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#ddd', fontSize: '16px' }}
                                  onMouseEnter={(e) => e.currentTarget.style.color = '#e53935'}
                                  onMouseLeave={(e) => e.currentTarget.style.color = '#ddd'}>✕</button>

                                <p style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e', margin: '0 0 10px', paddingRight: '20px', lineHeight: '1.4' }}>{task.title}</p>

                                {task.tags && task.tags.length > 0 && (
                                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                    {task.tags.map((tag) => (
                                      <span key={tag} style={{ fontSize: '10px', background: '#f0f0ff', color: '#6c63ff', padding: '2px 6px', borderRadius: '4px' }}>{tag}</span>
                                    ))}
                                  </div>
                                )}

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '5px', ...PRIORITY_STYLE[task.priority] }}>
                                    {PRIORITY_STYLE[task.priority]?.label || task.priority}
                                  </span>
                                  {task.dueDate && <span style={{ fontSize: '11px', color: '#aaa' }}>📅 {task.dueDate}</span>}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}

                        <button onClick={() => setShowAddModal(true)}
                          style={{ width: '100%', border: '1.5px dashed #d0d0d0', background: 'transparent', borderRadius: '10px', padding: '10px', color: '#bbb', cursor: 'pointer', fontSize: '12px' }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#6c63ff'; e.currentTarget.style.color = '#6c63ff' }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d0d0d0'; e.currentTarget.style.color = '#bbb' }}>
                          + Add card
                        </button>
                      </div>
                    </div>
                  )}
                </Droppable>
              )
            })}
          </div>
        )}

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </DragDropContext>
  )
}
