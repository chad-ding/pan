const path = require('path')
const AdmZip = require('adm-zip')

const zip = new AdmZip()

const rootDir = '/pan'

zip.addLocalFolder(path.resolve(process.cwd(), './background'), `${rootDir}/background`)
zip.addLocalFolder(path.resolve(process.cwd(), './content'), `${rootDir}/content`)
zip.addLocalFolder(path.resolve(process.cwd(), './icon'), `${rootDir}/icon`)
zip.addLocalFolder(path.resolve(process.cwd(), './popup'), `${rootDir}/popup`)
zip.addLocalFile(path.resolve(process.cwd(), './manifest.json'), rootDir)

zip.writeZip(path.resolve(process.cwd(), './pan.zip'))
