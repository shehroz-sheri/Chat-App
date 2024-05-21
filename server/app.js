const express = require('express');
const cookieParser = require('cookie-parser');
const connectMongoDb = require('./db/connection');
const userRoutes = require('./routes/user')
const chatRoutes = require('./routes/chat')
const cors = require('cors');
const User = require('./models/user');
const io = require('socket.io')(8080, {
    cors: {
        origin: 'http://localhost:3000'
    }
})



const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))



// Mongodb Connection
connectMongoDb('mongodb://localhost:27017/chatting-website').then(() => console.log('mongodb connection established'))

let users = []
io.on('connection', socket => {
    // console.log('User Connected Id', socket.id)
    socket.on('addUser', userId => {
        const isUserExist = users.find(user => user.userId === userId)

        if (!isUserExist) {
            const user = { userId, socketId: socket.id }
            users.push(user)
            io.emit('getUsers', users)

        }
    })

    socket.on('sendMessage', async ({ senderId, receiverId, message, conversationId }) => {
        // console.log(msgData)
        const receiver = users.find(user => user.userId === receiverId)
        const sender = users.find(user => user.userId === senderId)
        const user = await User.findById(senderId)

        if (receiver) {
            io.to(receiver.socketId).to(sender.socketId).emit('getMessage', {
                senderId,
                receiverId,
                message,
                conversationId,
                user: { userId: user._id, email: user.email, name: user.name, number: user.number }
            })
        } else {
            io.to(sender.socketId).emit('getMessage', {
                senderId,
                receiverId,
                message,
                conversationId,
                user: { userId: user._id, email: user.email, name: user.name, number: user.number }
            })
        }

    })


    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id)
        io.emit('getUsers', users)
    })
})


app.get('/', (req, res) => {
    res.cookie('jwt', 'This is cookie')
    return res.json({ message: 'Hello world' })
})

// Routes
app.use('/user', userRoutes)
app.use('/chat', chatRoutes)



app.listen(PORT, () => {
    console.log('server listening on port ' + PORT)
})