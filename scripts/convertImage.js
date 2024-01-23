import fs from 'fs'
import path from 'path'

const imgPath = 'src/assets/illustrations/bit-test-mint.webp'

const __dirname = new URL('.', import.meta.url).pathname
const root = path.join(__dirname, '..')

function convertImgToHex(url) {
  const file = fs.readFileSync(path.resolve(root, url))
  return file.toString('hex')
}

function convertImgToBase64(url) {
  const file = fs.readFileSync(path.resolve(root, url))
  const base64 = new Buffer(file).toString('base64')
  return `data:image/webp;base64,${base64}`
}

function main() {
  const hex = convertImgToHex(imgPath)
  const base64 = convertImgToBase64(imgPath)

  const outputFilePath = path.resolve(root, 'src/hooks/imgString.json')

  fs.writeFileSync(
    outputFilePath,
    JSON.stringify({
      hex: hex,
      base64: base64
    })
  )
}

main()
