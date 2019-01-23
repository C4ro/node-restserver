const jwt = require('jsonwebtoken');

// ================
// Verify token
// ================

let verifyToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid token'
                }
            });
        }

        req.user = decoded.user;

        next();
    });

};

// ================
// Verify ADMIN_ROLE
// ================

let verifyADMIN_ROLE = (req, res, next) => {

    let user = req.user;

    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {

        return res.status(401).json({
            ok: false,
            err: {
                message: 'Unauthorized user'
            }
        });

    }

};

// ================
// Verify token Img
// ================

let verifyTokenImg = (req, res, next) => {

    let token = req.query.token

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid token'
                }
            });
        }

        req.user = decoded.user;
        next();

    });
}


module.exports = {
    verifyToken,
    verifyADMIN_ROLE,
    verifyTokenImg
};