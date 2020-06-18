import Datastore from 'nedb'
import path from 'path'

let DB = new Datastore({
  autoload: true,
  // filename: path.join(process.env.USERPROFILE, './AppData/nn/data/nn.db')
  // 此代码在个别分支下报错，系统无法正常运行，故暂时注释掉。
  filename: ''
})
console.log('path: ', DB.filename)
const Store = require('electron-store')
const Storage = new Store()
export { DB, Storage }
