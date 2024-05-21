const User = require('../models/user')
const bcrypt = require('bcrypt');
const generateToken = require('../services/authToken');
const Conversation = require('../models/conversation');



const handleUserRegister = async (req, res) => {
    try {
        const { name, email, password, number } = req.body;

        if (!name || !email || !password || !number) {
            return res.status(400).send('All fields are required!')
        }
        const isEmailAlreadyExist = await User.findOne({ email })
        const isNumberAlreadyExist = await User.findOne({ number })


        if (isEmailAlreadyExist || isNumberAlreadyExist) {
            return res.status(400).send('User already exists!')
        }

        const user = await User.create({ name, email, password, number })
        // const token = generateToken(user)
        // res.cookie('jwt', token)

        return res.status(201).send('User created successfully!')

    } catch (error) {
        console.log(JSON.stringify(error))
    }
}

const handleUserLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send('All fields are required!')
        }

        const userEmail = await User.findOne({ email: username })
        const userNumber = await User.findOne({ number: username })
        if (!userEmail && !userNumber) {
            return res.status(404).send('User not found!')
        }

        let user = { ...userEmail, ...userNumber }
        user = user._doc

        const auth = await bcrypt.compare(password, user.password)

        if (!auth) {
            return res.status(400).send('Invalid credentials!')
        } else {
            const token = generateToken(user)
            res.cookie('token', token)
            await User.findByIdAndUpdate(user._id, { token })

            const userWithToken = await User.findOne(user._id)
            return res.status(200).json({ user: { userId: userWithToken._id, email: userWithToken.email, name: userWithToken.name, number: userWithToken.number }, token: userWithToken.token, message: 'Login Successful!' })
        }


    } catch (error) {

    }
}

const handleGetAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        const usersData = Promise.all(users.map(async (user) => {
            return { user: { email: user.email, name: user.name, number: user.number, userId: user._id } }
        }))

        res.status(200).json(await usersData)

    } catch (error) {

    }
}

const handleGetCurrentUser = async (req, res) => {
    try {
        const { user } = req.body

        const currentUser = await User.findOne({ email: user.email })
        return res.json(currentUser)

    } catch (error) {

    }
}

const handleDeleteUser = async (req, res) => {
    try {
        const { user } = req.body
        const currentUser = await User.findOne({ email: user.email })
        const userId = currentUser._id

        const con = await Conversation.find({ members: { $in: [userId] } })

        // const deleted = await User.findByIdAndDelete(currentUser._id)
        // const conversations = await Conversation.find({ members: { $in: [currentUser._id] } })

        // const conversationList = Promise.all(conversations.map(async (conversation) => {
        //     return conversation
        // }))
        // return res.status(200).json(await conversationList)

        // const users = await User.find({})

        // res.json(users)
        return res.json({ con })

    } catch (error) {

    }
}

const handleUpdateUser = async (req, res) => {
    try {
        const userEmail = req.params.user_email
        const { userDetails } = req.body
        return res.json({ userDetails, userEmail })

        // const currentUser = await User.findOne({ email: userEmail })
        // await User.findOneAndUpdate({ email: userEmail }, userDetails)
        // const user = await User.findById(currentUser._id)

        // return res.status(200).json({ user: { email: user.email, number: user.number, name: user.name, userId: user._id }, token: user.token })

    } catch (error) {
        return res.status(500).json({ message: 'Failed' })
    }

}





module.exports = {
    handleUserRegister, handleUserLogin, handleGetAllUsers,
    handleGetCurrentUser, handleDeleteUser, handleUpdateUser
}