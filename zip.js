const path = require('path')
const AdmZip = require('adm-zip')
const pkg = require('./package.json')
const manifest = require('./manifest.json')

const zip = new AdmZip()
const rootDir = '/pan'

zip.addLocalFolder(path.resolve(process.cwd(), './background'), `${rootDir}/background`)
zip.addLocalFolder(path.resolve(process.cwd(), './content'), `${rootDir}/content`)
zip.addLocalFolder(path.resolve(process.cwd(), './icon'), `${rootDir}/icon`)
zip.addLocalFolder(path.resolve(process.cwd(), './popup'), `${rootDir}/popup`)

// 将package.json中的版本号写入manifest
manifest.version = pkg.version
zip.addFile(`${rootDir}/manifest.json`, JSON.stringify(manifest, null, 4))

zip.writeZip(path.resolve(process.cwd(), './pan.zip'))
