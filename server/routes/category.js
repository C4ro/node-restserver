const express = require('express');
const _ = require('underscore');

const { verifyToken, verifyADMIN_ROLE } = require('../middlewares/authentication');

let app = express();

let Category = require('../models/category');

// ===================
// Show all categories
// ===================

app.get('/category', verifyToken, (req, res) => {
    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec((err, categories) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categories
            });
        });
});

// =====================
// Show a category by id
// =====================

app.get('/category/:id', verifyToken, (req, res) => {

    let id = req.params.id;

    Category.findById(id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Category not found'
                }
            })
        }

        res.json({
            ok: true,
            category: categoryDB
        })
    });

});

// =====================
// Create a new category
// =====================

app.post('/category', verifyToken, (req, res) => {

    //console.log(req.user._id);

    let category = new Category({
        description: req.body.description,
        user: req.user._id
    });

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            category: categoryDB
        });

    });

});

// =======================
// Update a category by id
// =======================

app.put('/category/:id', verifyToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['description']);

    Category.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    })

});

// =======================
// Delete a category by id
// =======================

app.delete('/category/:id', [verifyToken, verifyADMIN_ROLE], (req, res) => {

    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, deletedCategory) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!deletedCategory) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Category not found'
                }
            });
        }

        res.json({
            ok: true,
            category: deletedCategory
        });
    })
});



module.exports = app;