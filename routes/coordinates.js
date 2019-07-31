const express = require('express');
const router = express.Router();
const path = require('path')
const util  = require('util')
const fs = require('fs')
const readFile = util.promisify(fs.readFile)
const readDir = util.promisify(fs.readdir)
const axios = require('axios')
const exif = require('exif-parser')
var downloadDir = path.join(path.dirname(require.main.filename), 'download');

//write
async function downloadImage (url, fileName) {
    const writer = fs.createWriteStream(path.resolve(downloadDir, '', fileName))
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })
    response.data.pipe(writer)
}

//read
function readExif(resp){
    return  resp.map(function (singleFileName) {
        return readFile(singleFileName)
            .then(function (singleFileContent) {
                return (singleFileContent)
            })
    });
}

async function ydAsk(){
    const response = await axios.get('https://cloud-api.yandex.net:443/v1/disk/resources', {
        params:{
            path: 'disk:/Фотокамера/'
        },
        headers: {
            'accept': 'application/json',
            'Authorization': 'AgAAAAAVbsJrAAXMR68pGDCK7E9qp-iLIZoZZ1I'
        }
    });
    return response.data._embedded.items;
}


//read

readDir(downloadDir)
    .then(function (response) {
     return  response.map((el)=>{
        return    readFile(path.resolve(downloadDir, '', el));
       })
    })
    .then((response)=>{
        Promise.all(response)
            .then((r)=>{
                const coords =  r.map((el)=>{
                    const parser = exif.create(el)
                    const result = parser.parse()
                    console.log(result)
                })
            })
    })
    .catch(err => console.log(err))




router.get('/', function(req, res, next) {
    ydAsk()
        .then((response)=>{
            response.forEach((el)=>{
                    downloadImage(el.file, el.name)
                }
            );
            return response.map((el)=>{ return el.name})
        })
        .then((response)=>{
            Promise.all(readExif(response))
                .then(function (arrayWithResults) {
                    return arrayWithResults
                })
                .then((response)=>{
                    const coords =  response.map((el)=>{
                        const parser = exif.create(el)
                        const result = parser.parse()
                        return result
                    })
                    //console.log(coords)
                    res.send(coords)
                })
                .catch(function (error) {
                    //here you can handle any error
                    console.log(error)
                })
        });
});

module.exports = router;