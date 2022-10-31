import express from 'express'
import { login, register, sendOTP, verifyOTP, canRegister, me, logout, createForgotPasswordOTP, verifyForgotPasswordOTP, canResetPassword } from '../controller/user.controller'
import { authGuard } from '../utils/authGuard'
import { loginDataValidation, registerDataValidation, canRegisterValidation } from '../validation/user.validation'
const router = express.Router()

router.post('/register', async (req, res) => {
    const err = await registerDataValidation(req.body)
    if (err) return res.status(400).send(err.message)
    register(req, res)
})

router.post('/canRegister', async(req, res)=>{
    const err = await canRegisterValidation(req.body)
    if (err) return res.status(400).send(err.message)
    canRegister(req, res)
})

router.post('/login', async (req, res) => {
    const err = await loginDataValidation(req.body)
    if (err) return res.status(400).send(err.message)
    login(req, res)
})

router.post('/sendOTP', authGuard, async (req, res) => {
    await sendOTP(req, res)
})

router.post('/verify', authGuard, async (req, res) => {
    await verifyOTP(req, res)
})
router.post('/logout', authGuard, async (req, res) => {
    await logout(req, res)
})
router.get('/me', authGuard, async (req,res)=>{
    await me(req, res)
})

router.post('/forgot_password', async (req, res) => {
    await createForgotPasswordOTP(req, res)
})

router.post('/reset_password', async (req, res) => {
    await verifyForgotPasswordOTP(req, res)
})

router.post('/can_reset_password',(req, res) => {
    canResetPassword(req, res)
})

module.exports = router