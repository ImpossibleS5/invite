import { defineConfig } from 'astro/config'

const repoName = '04-07-26'
const ghUser = 'ImpossibleS5'

export default defineConfig({
  site: `https://${ghUser}.github.io`,
  base: `/${repoName}/`,
  output: 'static',
  build: { format: 'directory', assets: 'assets' },
  trailingSlash: 'always',
})
