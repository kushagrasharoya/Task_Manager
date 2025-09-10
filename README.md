# Task Manager (React + Vite)

A fast, modern task management web app with:

- Add, edit, delete tasks
- Mark complete/incomplete
- Filters (All, Active, Completed)
- Search by title or tag
- Tag/categories
- Priority levels and due dates
- Drag-and-drop reordering
- LocalStorage persistence

## Getting Started

Requirements: Node.js 18+

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open the URL printed by the dev command (usually http://localhost:5173).

## Notes

- Data is stored locally in your browser under key `tm_tasks_v1`.
- Drag-and-drop is powered by `@hello-pangea/dnd`.
- This project uses Vite for a fast DX.
