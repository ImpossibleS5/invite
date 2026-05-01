import { defineConfig } from 'astro/config'

const repoName = 'invite'
const ghUser = 'ImpossibleS5'

export default defineConfig({
  site: `https://${ghUser}.github.io`,
  base: `/${repoName}/`,
  output: 'static',
  build: { format: 'directory', assets: 'assets' },
  trailingSlash: 'always',
})
