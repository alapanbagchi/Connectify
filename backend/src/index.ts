import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import session from 'express-session'
import { createClient } from 'redis'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import cors from 'cors'

dotenv.config()
const PORT = process.env.PORT || 8080

const app = express()

const corsMiddleWare = cors({
    origin: process.env.CLIENT_URL?.split(','),
    credentials: true
})
app.use(corsMiddleWare)

//Redis setup
const RedisClient = createClient({
    legacyMode: true,
    url: 'rediss://:32f861f9ebec439d82a5c858d5382237@eu1-natural-perch-38192.upstash.io:38192',
    name: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD
});

//Get notified when a key is expired
RedisClient.on('message', (channel, message) => {
    console.log(`Key ${message} expired`);
});


let RedisStore = require('connect-redis')(session)
const RedisConnect = async () => {
    RedisClient.on('error', (err) => console.log('Redis Client Error', err));
    await RedisClient.connect();
}
//Save a file to redis with an expiry time of 2s

RedisConnect()

//Middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.set('trust proxy', 1);
app.use(cookieParser());
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24, sameSite: 'none', secure: true },
    resave: false,
    store: new RedisStore({
        client: RedisClient
    })
}));
app.use(passport.authenticate('session'))
require('./utils/passport')

//Routes
app.get('/',(req,res)=>{
    res.send({msg: "WELCOME TO CONNECT US BACKEND"})
})
app.use('/user',  require('./routes/user.router'))
app.use('/contact', require('./routes/contact.router'))
app.use('/todo', require('./routes/todo.router'))
app.use('/dailymail', require('./routes/dailymail.router'))
const startServer = async () => {
    await mongoose.connect(process.env.MONGO_URI!)
    console.log("Connected to MongoDB")
    app.listen(PORT, () => {
        console.log(`Server is running at ${PORT}`)
    })
}

startServer()
export {
    RedisClient
}
