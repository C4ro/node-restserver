const express = require('express');
const _ = require('underscore');

const { verifyToken } = require('../middlewares/authentication');

let app = express();

let Product = require('../models/product');

// ===================
// Show all products
// ===================

app.get('/product', verifyToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    Product.find({ available: true })
        .skip(from)
        .limit(limit)
        .sort('name')
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                products
            });
        });
});

// =====================
// Show a product by id
// =====================

app.get('/product/:id', verifyToken, (req, res) => {

    let id = req.params.id

    Product.findById(id, (err, productDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Product not found'
                    }
                });
            }

            res.json({
                ok: true,
                product: productDB
            });
        })
        .populate('user', 'name email')
        .populate('category', 'description');

});

// ========================
// Search a product by term
// ========================

app.get('/product/search/:term', verifyToken, (req, res) => {

    let term = req.params.term;

    let regex = new RegExp(term, 'i');

    Product.find({ name: regex })
        .populate('category', 'description')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                products
            });

        });

});


// =====================
// Create a new product
// =====================

app.post('/product', verifyToken, (req, res) => {

    let body = req.body;

    let product = new Product({
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        category: body.category,
        user: req.user._id
    });

    product.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            product: productDB
        });

    });

});

// =======================
// Update a product by id
// =======================

app.put('/product/:id', verifyToken, (req, res) => {

    let id = req.params.id
    let body = _.pick(req.body, ['name', 'unitPrice', 'description', 'category']);

    Product.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            product: productDB
        });
    });

});

// =======================
// Delete a product by id
// =======================

app.delete('/product/:id', verifyToken, (req, res) => {
    // disponible: falso

    let id = req.params.id;

    let changeAvailability = {
        available: false
    }

    Product.findByIdAndUpdate(id, changeAvailability, { new: true }, (err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!deletedProduct) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        }

        res.json({
            ok: true,
            product: deletedProduct
        });
    });

});

module.exports = app;