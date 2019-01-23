const express = require('express');
const fileUpload = require('express-fileupload');
let app = express();

const User = require('../models/user');
const Product = require('../models/product');

const fs = require('fs');
const path = require('path');

//default options
app.use(fileUpload());

app.put('/upload/:type/:id', (req, res) => {

    let type = req.params.type;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No file has been selected'
            }
        });
    }

    // Validate type
    let validTypes = ['products', 'users'];

    if (validTypes.indexOf(type) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err:  {
                    message: 'Valid types are ' + validTypes.join(', ')
                }
            });
    }

    let file = req.files.file;
    let fileName = file.name.split('.');
    let fileExt = fileName[fileName.length - 1];

    // Valid extensions
    let validExt = ['png', 'jpg', 'gif', 'jpeg'];

    if (validExt.indexOf(fileExt) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Valid extensions are ' + validExt.join(', '),
                    ext: fileExt
                }
            });
    }

    // Change name to file
    let newFileName = `${ id }-${ new Date().getMilliseconds() }.${ fileExt }`;

    file.mv(`uploads/${ type }/${ newFileName }`, (err) => {

        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        // File uploaded
        if (type === 'users') {
            imgUser(id, res, newFileName);
        } else {
            imgProduct(id, res, newFileName);
        }

    });
})

const imgUser = (id, res, newFileName) => {

    User.findById(id, (err, userDB) => {
        if (err) {
            deleteFile(newFileName, 'users');
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        if (!userDB) {
            deleteFile(newFileName, 'users');
            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'User not found'
                    }
                });
        }

        deleteFile(userDB.img, 'users');

        userDB.img = newFileName;

        userDB.save((err, savedUser) => {
            if (err) {
                return res.status(500)
                    .json({
                        ok: false,
                        err
                    });
            }

            res.json({
                ok: true,
                user: savedUser,
                img: newFileName
            });
        });

    });
}

const imgProduct = (id, res, newFileName) => {

    Product.findById(id, (err, productDB) => {
        if (err) {
            deleteFile(newFileName, 'products');
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        if (!productDB) {
            deleteFile(newFileName, 'products');
            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'Product not found'
                    }
                });
        }

        deleteFile(productDB.img, 'products');

        productDB.img = newFileName;

        productDB.save((err, savedProduct) => {
            if (err) {
                return res.status(500)
                    .json({
                        ok: false,
                        err
                    });
            }

            res.json({
                ok: true,
                product: savedProduct,
                img: newFileName
            });
        });
    });
}

const deleteFile = (fileName, type) => {
    let imgPath = path.resolve(__dirname, `../../uploads/${ type }/${ fileName }`);
    if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
    }
}

module.exports = app;