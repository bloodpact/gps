const express = require('express');
const router = express.Router();
const exif = require('exif-parser');
const readDir = require('../fileWorks/readfile');
const downloadImage = require('../fileWorks/writefile').downloadImage;
const ydAsk = require('../fileWorks/writefile').ydAsk;


router.get('/load',(req, res)=>{
    ydAsk()
        .then((response)=>{
            response.forEach((el)=>{
                downloadImage(el.file, el.name)
            })
        })
        .then(
            res.redirect('/')
        )
        .catch(err=>{console.log(err)})
})
router.get('/', (req, res) =>{
    readDir()
        .then((response)=>{
            Promise.all(response)
                .then((r)=>{
                    return r.map((el)=>{
                        const parser = exif.create(el);
                        const result = parser.parse();
                        return result.tags
                    })
                })
                .then((r) => {
                    res.send(r)
                })
        })
        .catch(err => console.log(err))
});

module.exports = router;