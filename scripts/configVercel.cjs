const fs = require('fs')
const path = require('path')
const root = path.join(__dirname, '..')

const CONFIG = {
  version: 2,
  routes: [
    {
      src: '/(.+\\.(png|ttf|otf))',
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    },
    {
      src: '/(.*)',
      headers: {
        'Cache-Control': 'public, max-age=0, must-revalidate'
      }
    }
  ]
}

const configVercelPath = path.resolve(root, 'dist/vercel.json')
fs.writeFileSync(configVercelPath, JSON.stringify(CONFIG))
