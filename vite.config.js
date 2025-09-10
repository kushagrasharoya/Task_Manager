import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: (() => {
    // On GitHub Actions we can infer repo name from GITHUB_REPOSITORY (owner/repo)
    const repo = process.env.GITHUB_REPOSITORY?.split('/')?.[1]
    const isCI = process.env.GITHUB_ACTIONS === 'true'
    if (!isCI || !repo) return '/'
    // If deploying to user/org pages (repo like username.github.io), base must be '/'
    if (/\.github\.io$/i.test(repo)) return '/'
    return `/${repo}/`
  })(),
})
