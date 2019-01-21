const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');
const { verifyToken, verifyADMIN_ROLE  } = require('../middlewares/authentication');

const app = express();

// ===================
// Show users per pages
// ===================

app.get('/user', verifyToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    User.find({ state: true }, 'name email role state google img')
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.countDocuments({ state: true }, (err, count) => {

                res.json({
                    ok: true,
                    users,
                    count
                })

            })
        })
})

// ===================================
// Create a new user (ADMIN_ROLE only)
// ===================================

app.post('/user', [verifyToken, verifyADMIN_ROLE], (req, res) => {

    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            user: userDB
        })
    })
})

// =====================================
// Update a user by id (ADMIN_ROLE only)
// =====================================

app.put('/user/:id', [verifyToken, verifyADMIN_ROLE], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    })
})

// =====================================
// Delete a user by id (ADMIN_ROLE only)
// =====================================

app.delete('/user/:id', [verifyToken, verifyADMIN_ROLE], (req, res) => {

    let id = req.params.id;

    let changeState = {
        state: false
    };

    // User.findByIdAndRemove(id, (err, deletedUser) => {

    User.findByIdAndUpdate(id, changeState, { new: true }, (err, deletedUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!deletedUser) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        }

        res.json({
            ok: true,
            user: deletedUser
        });
    })
})

module.exports = app;