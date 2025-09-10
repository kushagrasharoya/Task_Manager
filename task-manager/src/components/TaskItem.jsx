import React, { useMemo, useState } from 'react'

export default function TaskItem({ task, onToggle, onDelete, onEdit, onTagClick }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [dueDate, setDueDate] = useState(task.dueDate || '')
  const [priority, setPriority] = useState(task.priority || 'medium')
  const [tagsStr, setTagsStr] = useState((task.tags || []).join(', '))

  const isOverdue = useMemo(() => {
    if (!task.dueDate || task.completed) return false
    try {
      const today = new Date()
      today.setHours(0,0,0,0)
      const d = new Date(task.dueDate)
      return d < today
    } catch { return false }
  }, [task.dueDate, task.completed])

  function save() {
    const updates = {
      title: title.trim() || task.title,
      dueDate,
      priority,
      tags: tagsStr
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
    }
    onEdit(updates)
    setEditing(false)
  }

  function confirmDelete() {
    if (window.confirm('Delete this task?')) onDelete()
  }

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="left">
        <input type="checkbox" checked={task.completed} onChange={onToggle} />
        {!editing ? (
          <div className="view">
            <div className="title-row">
              <span className="title">{task.title}</span>
              {task.priority && <span className={`pill ${task.priority}`}>{task.priority}</span>}
            </div>
            <div className="meta">
              {(task.tags || []).map(tag => (
                <button
                  type="button"
                  className="tag"
                  key={tag}
                  onClick={() => onTagClick && onTagClick(tag)}
                  title={`Filter by #${tag}`}
                >
                  #{tag}
                </button>
              ))}
              {task.dueDate && <span className={`due ${isOverdue ? 'overdue' : ''}`}>Due: {task.dueDate}</span>}
            </div>
          </div>
        ) : (
          <div className="edit">
            <input
              className="input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Task title"
            />
            <div className="row">
              <input className="input" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
              <select className="input" value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <input
              className="input"
              value={tagsStr}
              onChange={e => setTagsStr(e.target.value)}
              placeholder="Comma-separated tags"
            />
          </div>
        )}
      </div>
      <div className="actions">
        {!editing ? (
          <>
            <button className="btn" onClick={() => setEditing(true)}>Edit</button>
            <button className="btn danger" onClick={confirmDelete}>Delete</button>
          </>
        ) : (
          <>
            <button className="btn" onClick={save}>Save</button>
            <button className="btn ghost" onClick={() => setEditing(false)}>Cancel</button>
          </>
        )}
      </div>
    </div>
  )
}
