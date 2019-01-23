const express = require('express');
const fs = require('fs');
const path = require('path');
const { verifyTokenImg } = require('../middlewares/authentication');

let app = express();

app.get('/image/:type/:img', verifyTokenImg, (req, res) => {
    let type = req.params.type;
    let img = req.params.img;

    let imgPath = path.resolve(__dirname, `../../uploads/${ type }/${ img }`);

    if (fs.existsSync(imgPath)) {
        res.sendFile(imgPath)
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }

});

module.exports = app;