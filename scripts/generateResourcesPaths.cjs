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

const allImages = getResourcePaths('./dist/static/png')

const imgsOutputFilePath = path.resolve(root, 'src/hooks/imgPaths.json')
fs.writeFileSync(
  imgsOutputFilePath,
  `[${allImages.map((i) => `"${i}"`).join(',')}]`
)
