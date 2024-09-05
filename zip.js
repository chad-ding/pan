const path = require('path')
const AdmZip = require('adm-zip')

const zip = new AdmZip()
const rootDir = '/pan'

zip.addLocalFolder(path.resolve(process.cwd(), './dist'), rootDir)

zip.writeZip(path.resolve(process.cwd(), './pan.zip'))
