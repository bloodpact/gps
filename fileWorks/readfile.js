const path = require('path')
const util  = require('util')
const fs = require('fs')
const readFile = util.promisify(fs.readFile)
const readDir = util.promisify(fs.readdir)
const downloadDir = require('../config').downloadDir
module.exports = async function(){
  return  await readDir(downloadDir)
        .then(function (response) {
            return  response.map((el)=>{
                return    readFile(path.resolve(downloadDir, '', el));
            })
        })
}