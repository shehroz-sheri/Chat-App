const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Name is required!'] },
    email: {
        type: String, required: [true, 'Email is required!'], unique: true, lowercase: true,
        validate: [isEmail, 'Email is not valid']
    },
    password: { type: String, required: true, minLength: [6, 'Password must be of at least 6 characters!'] },
    number: { type: String, required: [true, 'Phone Number is required!'], unique: true, minLength: [8, 'Phone Number must be of at least 8 characters!'] },
    token: { type: String }

}, { timestamps: true })


// fire a function after doc created in db
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)

    next()
})

// static function to login user
// userSchema.static.login = async function (username, password) {
//     const userEmail = await this.findOne({ email: username })
//     const userNumber = await this.findOne({ number: username })
//     if (!userEmail && !userNumber) {
//         return res.status(404).send('User not found!')
//     }

//     const user = { ...userEmail, ...userNumber }
//     console.log(user)
//     return
// }


const User = mongoose.model('User', userSchema);

module.exports = User;