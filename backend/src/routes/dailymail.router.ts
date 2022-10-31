import express from 'express'
import { sendEmail } from '../utils/nodemailer'
import { dailyMail } from '../controller/dailymail.controller'
const router = express.Router()

router.post('/send', (req,res) => {
    dailyMail(req,res)
})

router.post('/test', (req,res) => {
    sendEmail('alapanbagchi.dev@gmail.com','test','test')
    res.status(200).send('test')
})

module.exports = router