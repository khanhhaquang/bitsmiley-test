const path = require('path')
const fs = require('fs')

const root = path.join(__dirname, '../..')

function getResourcePaths(directoryPath, allFileNames = []) {
  const files = fs.readdirSync(path.resolve(root, directoryPath))

  files.forEach((file) => {
    const filePath = `${directoryPath}/${file}`
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      getResourcePaths(filePath, allFileNames)
    } else {
      allFileNames.push(`${directoryPath.substr(1)}/${file}`)
    }
  })

  return allFileNames
}

// const fonts = getResourcePaths('./src/assets/fonts')
const frames = getResourcePaths('./src/assets/frames')
const icons = getResourcePaths('./src/assets/icons')
const illustrations = getResourcePaths('./src/assets/illustrations')

const allImages = [...frames, ...icons, ...illustrations]

const outputFilePath = path.resolve(root, './src/scripts/resourcePaths.json')
fs.writeFileSync(
  outputFilePath,
  `[${allImages.map((i) => `"${i}"`).join(',')}]`
)
