import React, { useState } from 'react'

export default function TaskEditor({ onSubmit, allTags }) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('medium')
  const [tagsStr, setTagsStr] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!title.trim()) return
    const tags = tagsStr
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
    onSubmit({ title, dueDate, priority, tags })
    setTitle('')
    setDueDate('')
    setPriority('medium')
    setTagsStr('')
  }

  return (
    <form className="card" onSubmit={submit}>
      <div className="row">
        <input
          className="input flex"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Add a new task..."
        />
        <button className="btn primary" type="submit">Add</button>
      </div>
      <div className="row wrap gap">
        <input className="input" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        <select className="input" value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          className="input flex"
          value={tagsStr}
          onChange={e => setTagsStr(e.target.value)}
          placeholder="Tags (comma-separated)"
          list="tags-list"
        />
        <datalist id="tags-list">
          {allTags.map(tag => (
            <option value={tag} key={tag} />
          ))}
        </datalist>
      </div>
    </form>
  )
}
