# Personal Notes Manager (Remix)

Ocean Professional themed personal notes manager with client-side persistence.

## Development
- Install dependencies: `npm install`
- Run the dev server: `npm run dev` (served at port 3000)

## Features
- Sidebar with note list and New button
- Note detail editor with title, content, save, delete
- LocalStorage persistence (no backend)
- Remix loaders/actions used safely for client-side storage
- Responsive modern UI with Tailwind CSS

## Notes
- Reads optional environment flags via `import.meta.env.*` when present (e.g., VITE_NODE_ENV).
- Routes:
  - `/` index empty state
  - `/notes/new` create new then redirect
  - `/notes/:id` edit/view
