const fs = require('fs');
const path = require('path');
const axios = require('axios');
const downloadDir = require('../config').downloadDir;
module.exports = {
    downloadImage:  async function  (url, fileName) {
            const writer = fs.createWriteStream(path.resolve(downloadDir, '', fileName));
            const response = await axios({
                url,
                method: 'GET',
                responseType: 'stream'
            })
            response.data.pipe(writer)
        },

    ydAsk: async function(){
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
}
