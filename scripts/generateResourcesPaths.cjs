const path = require('path')
const fs = require('fs')

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
const allImages = [...allPngs, ...allSvgs]

const outputFilePath = path.resolve(root, 'src/hooks/resourcePaths.json')

fs.writeFileSync(
  outputFilePath,
  JSON.stringify({
    images: allImages
  })
)
