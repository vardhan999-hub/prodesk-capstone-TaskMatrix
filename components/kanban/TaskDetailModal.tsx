'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Task, TaskPriority, TaskStatus } from '@/types/task'
interface TaskDetailModalProps {
  task: Task
  onClose: () => void
  onTaskUpdated: () => void
}

const PRIORITY_STYLE: Record<TaskPriority, { background: string; color: string }> = {
  high: { background: '#fce4e4', color: '#c62828' },
  medium: { background: '#fff8e1', color: '#f57f17' },
  low: { background: '#e8f5e9', color: '#2e7d32' },
}

const STATUS_OPTIONS: {
  value: TaskStatus
  label: string
  color: string
}[] = [
  { value: 'todo', label: 'To Do', color: '#666' },
  { value: 'inProgress', label: 'In Progress', color: '#e65100' },
  { value: 'review', label: 'Review', color: '#1565c0' },
  { value: 'done', label: 'Done', color: '#2e7d32' },
]

export default function TaskDetailModal({
  task,
  onClose,
  onTaskUpdated,
}: TaskDetailModalProps) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
 const [priority, setPriority] = useState<TaskPriority>(
  task.priority
)
  const [status, setStatus] = useState<TaskStatus>(
  task.status
)
  const [dueDate, setDueDate] = useState(task.dueDate || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)

    const { error } = await supabase
      .from('tasks')
      .update({
        title,
        description,
        priority,
        status,
        dueDate,
      })
      .eq('id', task.id)

    if (error) {
      console.error('Error updating task:', error)
    } else {
      setSaved(true)

      setTimeout(() => {
        setSaved(false)
      }, 2000)

      onTaskUpdated()
    }

    setSaving(false)
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this task?'
    )

    if (!confirmDelete) return

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', task.id)

    if (error) {
      console.error('Error deleting task:', error)
    } else {
      onTaskUpdated()
      onClose()
    }
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.45)',
          zIndex: 100,
        }}
      />

      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          borderRadius: '20px',
          width: '620px',
          maxHeight: '85vh',
          overflowY: 'auto',
          zIndex: 101,
          boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
          fontFamily: 'Segoe UI, sans-serif',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 28px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            position: 'sticky',
            top: 0,
            background: 'white',
          }}
        >
          <div
            style={{
              flex: 1,
              paddingRight: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  background: '#f0f0f0',
                  color: '#888',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}
              >
                #{task.id}
              </span>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '5px',
                  ...PRIORITY_STYLE[priority],
                }}
              >
                {priority?.toUpperCase()} PRIORITY
              </span>
            </div>

            <input
              value={title}
              onChange={(e) =>
  setPriority(e.target.value as TaskPriority)
}
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#1a1a2e',
                border: 'none',
                outline: 'none',
                width: '100%',
                background: 'transparent',
                fontFamily: 'Segoe UI, sans-serif',
              }}
            />
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#f5f5f5',
              border: 'none',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            display: 'flex',
          }}
        >
          {/* Left Side */}
          <div
            style={{
              flex: 1,
              padding: '24px 28px',
              borderRight: '1px solid #f0f0f0',
            }}
          >
            {/* Status */}
            <div
              style={{
                marginBottom: '24px',
              }}
            >
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#888',
                  display: 'block',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                }}
              >
                Status
              </label>

              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                }}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setStatus(opt.value)}
                    style={{
                      flex: 1,
                      padding: '8px 4px',
                      borderRadius: '8px',
                      border: `1.5px solid ${
                        status === opt.value
                          ? opt.color
                          : '#e8eaed'
                      }`,
                      background:
                        status === opt.value
                          ? opt.color + '15'
                          : 'white',
                      color:
                        status === opt.value
                          ? opt.color
                          : '#aaa',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'Segoe UI, sans-serif',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div
              style={{
                marginBottom: '24px',
              }}
            >
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#888',
                  display: 'block',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                }}
              >
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Add a description..."
                rows={4}
                style={{
                  width: '100%',
                  border: '1.5px solid #e8eaed',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'Segoe UI, sans-serif',
                }}
              />
            </div>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div>
                <label
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#888',
                    display: 'block',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                  }}
                >
                  Tags
                </label>

                <div
                  style={{
                    display: 'flex',
                    gap: '6px',
                    flexWrap: 'wrap',
                  }}
                >
                  {task.tags.map((tag: string) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '12px',
                        background: '#f0f0ff',
                        color: '#6c63ff',
                        padding: '4px 10px',
                        borderRadius: '6px',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Side */}
          <div
            style={{
              width: '190px',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {/* Priority */}
            <div>
              <label
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#aaa',
                  display: 'block',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                }}
              >
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value)
                }
                style={{
                  width: '100%',
                  border: '1.5px solid #e8eaed',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  fontSize: '13px',
                  outline: 'none',
                  background: 'white',
                  fontFamily: 'Segoe UI, sans-serif',
                }}
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#aaa',
                  display: 'block',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                }}
              >
                Due Date
              </label>

              <input
                type="date"
                value={dueDate}
                onChange={(e) =>
                  setDueDate(e.target.value)
                }
                style={{
                  width: '100%',
                  border: '1.5px solid #e8eaed',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'Segoe UI, sans-serif',
                }}
              />
            </div>

            {/* Project */}
            <div>
              <label
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#aaa',
                  display: 'block',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                }}
              >
                Project
              </label>

              <span
                style={{
                  fontSize: '13px',
                  color: '#888',
                }}
              >
                Project Alpha
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 28px',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            background: '#fafafa',
            borderRadius: '0 0 20px 20px',
          }}
        >
          {/* Delete */}
          <button
            onClick={handleDelete}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1.5px solid #fce4e4',
              background: 'white',
              color: '#e53935',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Segoe UI, sans-serif',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background =
                '#fce4e4')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background =
                'white')
            }
          >
            Delete Task
          </button>

          {/* Right Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1.5px solid #e8eaed',
                background: 'white',
                color: '#555',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Segoe UI, sans-serif',
              }}
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: saved
                  ? '#4caf50'
                  : '#1a1a2e',
                color: 'white',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Segoe UI, sans-serif',
              }}
              onMouseEnter={(e) => {
                if (!saving && !saved) {
                  e.currentTarget.style.background =
                    '#6c63ff'
                }
              }}
              onMouseLeave={(e) => {
                if (!saving && !saved) {
                  e.currentTarget.style.background =
                    '#1a1a2e'
                }
              }}
            >
              {saving
                ? 'Saving...'
                : saved
                ? '✓ Saved!'
                : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
