import React from 'react'

export default function Filters({
  filter, setFilter,
  search, setSearch,
  tagFilter, setTagFilter,
  allTags,
  priorityFilter, setPriorityFilter,
  sortBy, setSortBy,
  clearCompleted,
}) {
  return (
    <div className="card filters">
      <div className="row wrap gap">
        <div className="segmented">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>Active</button>
          <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Completed</button>
        </div>

        <input
          className="input flex"
          placeholder="Search by title or tag"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select className="input" value={tagFilter} onChange={e => setTagFilter(e.target.value)}>
          <option value="">All Tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>

        <select className="input" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select className="input" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="created-desc">Newest First</option>
          <option value="due-asc">Due Date (Soonest)</option>
          <option value="priority-desc">Priority (High→Low)</option>
          <option value="title-asc">Title (A→Z)</option>
        </select>

        <button className="btn ghost" onClick={clearCompleted}>Clear Completed</button>
      </div>
    </div>
  )
}
