const jwt = require('jsonwebtoken')


const maxAge = 3 * 24 * 60 * 60
const Secret_Key = process.env.SECRET_KEY || 'ask@7873k&jdw%j$23jkd'

const generateToken = user => {
    return jwt.sign({
        id: user._id,
        email: user.email,
        number: user.number,
        name: user.name,

    }, Secret_Key, { expiresIn: maxAge })
}


module.exports = generateToken