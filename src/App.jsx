import React, { useEffect, useMemo, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import TaskItem from './components/TaskItem.jsx'
import TaskEditor from './components/TaskEditor.jsx'
import Filters from './components/Filters.jsx'

const STORAGE_KEY = 'tm_tasks_v1'

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const tasks = JSON.parse(raw)
    return Array.isArray(tasks) ? tasks : []
  } catch {
    return []
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export default function App() {
  const [tasks, setTasks] = useState(() => loadTasks())
  const [filter, setFilter] = useState('all') // all | active | completed
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all') // all | low | medium | high
  const [theme, setTheme] = useState(() =>
    document.documentElement.getAttribute('data-theme') || 'dark'
  )
  const [sortBy, setSortBy] = useState('created-desc') // created-desc|due-asc|priority-desc|title-asc

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  useEffect(() => {
    try {
      localStorage.setItem('tm_theme', theme)
    } catch {}
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const allTags = useMemo(() => {
    const s = new Set()
    tasks.forEach(t => (t.tags || []).forEach(tag => s.add(tag)))
    return Array.from(s)
  }, [tasks])

  function toggleTheme() {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  function addTask(data) {
    const now = new Date().toISOString()
    const newTask = {
      id: crypto.randomUUID(),
      title: data.title.trim(),
      completed: false,
      tags: data.tags || [],
      dueDate: data.dueDate || '',
      priority: data.priority || 'medium',
      createdAt: now,
    }
    setTasks(prev => [...prev, newTask])
  }

  function updateTask(id, updates) {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)))
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  function clearCompleted() {
    setTasks(prev => prev.filter(t => !t.completed))
  }

  const filteredTasks = tasks
    .filter(t => {
      if (filter === 'active') return !t.completed
      if (filter === 'completed') return t.completed
      return true
    })
    .filter(t => {
      if (!tagFilter) return true
      return (t.tags || []).includes(tagFilter)
    })
    .filter(t => {
      if (priorityFilter === 'all') return true
      return (t.priority || 'medium') === priorityFilter
    })
    .filter(t => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        t.title.toLowerCase().includes(q) ||
        (t.tags || []).some(tag => tag.toLowerCase().includes(q))
      )
    })
  
  const sortedTasks = useMemo(() => {
    const list = [...filteredTasks]
    const now = new Date()
    const priorityRank = { high: 3, medium: 2, low: 1 }
    function cmpTitle(a, b) { return a.title.localeCompare(b.title) }
    function cmpCreated(a, b) { return new Date(a.createdAt) - new Date(b.createdAt) }
    function cmpDue(a, b) {
      const ad = a.dueDate ? new Date(a.dueDate) : null
      const bd = b.dueDate ? new Date(b.dueDate) : null
      if (!ad && !bd) return 0
      if (!ad) return 1
      if (!bd) return -1
      return ad - bd
    }
    function cmpPriority(a, b) {
      const ap = priorityRank[a.priority] || 0
      const bp = priorityRank[b.priority] || 0
      return bp - ap
    }
    switch (sortBy) {
      case 'title-asc':
        list.sort(cmpTitle)
        break
      case 'due-asc':
        list.sort(cmpDue)
        break
      case 'priority-desc':
        list.sort(cmpPriority)
        break
      case 'created-desc':
      default:
        list.sort(cmpCreated).reverse()
        break
    }
    return list
  }, [filteredTasks, sortBy])

  function onDragEnd(result) {
    const { destination, source } = result
    if (!destination) return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return

    // Reorder within the currently displayed (sorted) view
    const visibleIds = sortedTasks.map(t => t.id)
    const reordered = Array.from(visibleIds)
    const [moved] = reordered.splice(source.index, 1)
    reordered.splice(destination.index, 0, moved)

    // map this order back into the full tasks array
    setTasks(prev => {
      const idToTask = new Map(prev.map(t => [t.id, t]))
      const newList = [...prev]
      // Only reorder the subset; keep relative positions of others
      const indices = newList
        .map((t, idx) => ({ id: t.id, idx }))
        .filter(x => reordered.includes(x.id))
        .map(x => x.idx)

      // Extract subset in current order
      const subset = indices.map(i => newList[i])
      // Place according to reordered ids
      const orderedSubset = reordered.map(id => idToTask.get(id))

      // Write back
      indices.forEach((pos, i) => {
        newList[pos] = orderedSubset[i]
      })

      return newList
    })
  }

  const remaining = useMemo(() => tasks.filter(t => !t.completed).length, [tasks])
  const total = tasks.length

  return (
    <div className="container">
      <header>
        <div>
          <h1>Task Manager</h1>
          <div className="subtitle">{remaining} of {total} tasks remaining</div>
        </div>
        <button
          className="btn ghost theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title="Toggle dark/light mode"
        >
          {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>

      <TaskEditor onSubmit={addTask} allTags={allTags} />

      <Filters
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
        tagFilter={tagFilter}
        setTagFilter={setTagFilter}
        allTags={allTags}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        clearCompleted={clearCompleted}
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="task-list">
          {provided => (
            <ul className="task-list" ref={provided.innerRef} {...provided.droppableProps}>
              {filteredTasks.length === 0 && (
                <li>
                  <div className="card empty-state">
                    <div className="empty-title">No tasks to show</div>
                    <div className="empty-desc">Try adding a task or adjusting filters/search.</div>
                  </div>
                </li>
              )}
              {sortedTasks.map((task, idx) => (
                <Draggable draggableId={task.id} index={idx} key={task.id}>
                  {prov => (
                    <li ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
                      <TaskItem
                        task={task}
                        onToggle={() => updateTask(task.id, { completed: !task.completed })}
                        onDelete={() => deleteTask(task.id)}
                        onEdit={(updates) => updateTask(task.id, updates)}
                        onTagClick={(tag) => setTagFilter(tag)}
                      />
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      <footer>
        <small>Data is saved locally in your browser.</small>
      </footer>
    </div>
  )
}
