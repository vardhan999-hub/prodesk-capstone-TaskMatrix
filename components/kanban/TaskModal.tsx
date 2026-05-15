'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import { TaskPriority, TaskStatus } from '@/types/task'

interface TaskModalProps {
  onClose: () => void
  onTaskAdded: () => void
}

export default function TaskModal({ onClose, onTaskAdded }: TaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [dueDate, setDueDate] = useState('')
  const [tags, setTags] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuthStore()

  const handleSubmit = async () => {
    if (!title.trim()) return setError('Task title is required!')
    setLoading(true)

    const newTask = {
      userId: user?.id,
      assigneeId: user?.id,
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      dueDate: dueDate || null,
      tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    }

    const { error: supabaseError } = await supabase.from('tasks').insert([newTask])

    if (supabaseError) {
      setError('Failed to create task. Please try again.')
      setLoading(false)
      return
    }

    setLoading(false)
    onTaskAdded()
    onClose()
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100 }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', borderRadius: '20px', padding: '32px', width: '500px', zIndex: 101, boxShadow: '0 24px 64px rgba(0,0,0,0.2)', fontFamily: 'Segoe UI, sans-serif' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Create New Task</h2>
            <p style={{ fontSize: '13px', color: '#888', margin: '4px 0 0' }}>Fill in the details below</p>
          </div>
          <button onClick={onClose} style={{ background: '#f5f5f5', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#444', display: 'block', marginBottom: '6px' }}>Task Title *</label>
          <input value={title} onChange={(e) => { setTitle(e.target.value); setError('') }}
            placeholder="e.g. Design the login page"
            style={{ width: '100%', border: `1.5px solid ${error ? '#e53935' : '#e8eaed'}`, borderRadius: '10px', padding: '11px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Segoe UI, sans-serif' }} />
          {error && <p style={{ color: '#e53935', fontSize: '12px', margin: '4px 0 0' }}>{error}</p>}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#444', display: 'block', marginBottom: '6px' }}>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="What needs to be done?" rows={3}
            style={{ width: '100%', border: '1.5px solid #e8eaed', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'Segoe UI, sans-serif' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#444', display: 'block', marginBottom: '6px' }}>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}
              style={{ width: '100%', border: '1.5px solid #e8eaed', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', outline: 'none', background: 'white', fontFamily: 'Segoe UI, sans-serif' }}>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#444', display: 'block', marginBottom: '6px' }}>Column</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}
              style={{ width: '100%', border: '1.5px solid #e8eaed', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', outline: 'none', background: 'white', fontFamily: 'Segoe UI, sans-serif' }}>
              <option value="todo">To Do</option>
              <option value="inProgress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '28px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#444', display: 'block', marginBottom: '6px' }}>Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
              style={{ width: '100%', border: '1.5px solid #e8eaed', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Segoe UI, sans-serif' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#444', display: 'block', marginBottom: '6px' }}>Tags</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="frontend, sprint-3"
              style={{ width: '100%', border: '1.5px solid #e8eaed', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Segoe UI, sans-serif' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onClose}
            style={{ flex: 1, padding: '13px', borderRadius: '10px', border: '1.5px solid #e8eaed', background: 'white', color: '#555', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Segoe UI, sans-serif' }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            style={{ flex: 1, padding: '13px', borderRadius: '10px', border: 'none', background: loading ? '#aaa' : '#1a1a2e', color: 'white', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Segoe UI, sans-serif' }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#6c63ff' }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#1a1a2e' }}>
            {loading ? 'Creating...' : '✓ Create Task'}
          </button>
        </div>
      </div>
    </>
  )
}
