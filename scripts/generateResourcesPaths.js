import fs from 'fs'
import path from 'path'
import { URL } from 'url'

const __dirname = new URL('.', import.meta.url).pathname
const root = path.join(__dirname, '..')

function getResourcePaths(directoryPath, allFileNames = []) {
  const files = fs.readdirSync(path.resolve(root, directoryPath))

  files.forEach((file) => {
    const filePath = `${directoryPath}/${file}`
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      getResourcePaths(filePath, allFileNames)
    } else {
      allFileNames.push(`${directoryPath.substr(6)}/${file}`)
    }
  })

  return allFileNames
}

const allPngs = getResourcePaths('./dist/static/png')
const allSvgs = getResourcePaths('./dist/static/svg')
const allWebps = getResourcePaths('./dist/static/webp')
const allImages = [...allPngs, ...allSvgs, ...allWebps]

const outputFilePath = path.resolve(root, 'src/hooks/resourcePaths.json')

fs.writeFileSync(
  outputFilePath,
  JSON.stringify({
    images: allImages
  })
)
