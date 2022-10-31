import { Request, Response } from 'express'
import userModel from '../models/user.model'
import bcrypt from 'bcrypt'
import { generateOTP } from '../utils/generateOTP'
import { RedisClient } from '..'
import { sendEmail } from '../utils/nodemailer'

const register = async (req: Request, res: Response) => {
    const { fullName, email, password, dob, timezone } = req.body
    try {
        // > Check if user already exists
        const user = await userModel.findOne({ email })
        if (user) return res.status(400).send({
            msg: 'USER_EXISTS'
        })

        // > Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // > Create new user
        const newUser = new userModel({
            fullName,
            email: email.toLowerCase().trim(),
            verified: false,
            password: hashedPassword,
            timezone,
            dob: new Date(dob),
            last_daily_mail: new Date(new Date().toLocaleString('en-US', { timeZone: timezone })).setHours(0, 0, 0, 0),
        })

        // > Save user and send response   
        await newUser.save()

        return res.status(201).send({
            msg: 'USER_CREATED_SUCCESSFULLY'
        })
    } catch (err) {
        return res.status(400).send(err)
    }
}

const canRegister = async (req: Request, res: Response) => {
    const { email } = req.body
    try {
        // > Check if user already exists
        const user = await userModel.findOne({ email })
        if (user) return res.status(400).send({
            msg: 'USER_EXISTS'
        })

        return res.status(200).send({
            msg: 'USER_CAN_REGISTER'
        })
    }
    catch (err) {
        return res.status(400).send(err)
    }
}

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body
    try {
        // > Check if user exists
        const user = await userModel.findOne({ email })

        if (!user) return res.status(400).send({
            msg: "USER_DOES_NOT_EXIST"
        })

        // > Check if password is correct
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) return res.status(400).send({
            msg: "INVALID_PASSWORD"
        })

        // > Check if user is already logged in
        if (req.isAuthenticated()) return res.status(400).send({
            msg: "USER_ALREADY_LOGGED_IN"
        })

        // > Make a new object with important fields
        const userObject = {
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar,
            id: user._id,
            verified: user.verified,
            role: user.role,
            timezone: user.timezone
        }
        // > Check if the session is already in the redis store and if it is then delete it
        const session = await RedisClient.v4.get(req.sessionID)
        if (session) await RedisClient.v4.del(req.sessionID)
        
        // > Login user
        req.login(userObject, (err) => {
            if (err) return res.status(400).send(err)
            return res.status(200).send({
                msg: "LOGIN_SUCCESSFUL"
            })
        })

    } catch (err) {
        return res.status(400).send(err)
    }
}

const sendOTP = async (req: Request, res: Response) => {
    try {
        // > Generate the OTP link
        const otp = generateOTP()

        // > Check if the user is already logged in
        if (!req.isAuthenticated()) return res.status(400).send({
            msg: "USER_NOT_LOGGED_IN"
        })

        // > Check if the user is already verified
        if (req.user.verified) return res.status(400).send({
            msg: "USER_ALREADY_VERIFIED"
        })

        // > If the OTP is already present in redis, dont create a new OTP
        const oldOTP = await RedisClient.v4.get(req.user.id)

        // > Set the OTP in redis for 10 minutes
        await RedisClient.v4.set(req.user.id, otp)
        await RedisClient.v4.expire(req.user.id, 600)
        
        if (!req.user) return res.status(400).send({
            msg: "OTP_EXPIRED"
        })

        // > Find the user in the database and send an error if not found
        const user = await userModel.findById(req.user.id)
        if (!user) return res.status(400).send({
            msg: 'USER_NOT_REGISTERED'
        })

        // > Load the email template
        const emailTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
            <link rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        </head>
        
        <body>
            <section>
                <div class="wrapper">
                    <div class="content">
                        <h1>Verify Your Email</h1>
                        <p>Thanks for signing up for Connectify. Please click the button below to verify your email address.</p>
                        <a href="{{link}}" class="btn">
                            <button>Verify Email</button>
                        </a>
                    </div>
                </div>
            </section>
        </body>
        
        </html>
        
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Arial', sans-serif;
            }
        
            section {
                width: 100%;
                height: 100vh;
                display: flex;
                justify-content: center;
                background-color: #FAFAFA;
            }
        
            .wrapper {
                width: 100%;
                height: fit-content;
                background-color: #FFFFFF;
                margin-top: 30px;
                max-width: 450px;
                max-height: 560px;
            }
        
            .image {
                width: 100%;
                height: 100%;
                padding: 30px 0;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #F4EEE2;
            }
        
            .image img {
                width: 130px;
                height: 100%;
                object-fit: contain;
            }
        
            .content {
                padding: 40px;
                text-align: center;
            }
        
            .content p {
                margin: 30px 0;
                line-height: 25px;
                opacity: 0.6;
            }
        
            button {
                color: #ffffff;
                font-size: 14px;
                padding: 12px 0;
                border-radius: 7px;
                border: none;
                cursor: pointer;
                transition: all 0.3s ease-in-out;
                font-weight: 600;
                background-color: #225DBB;
                border: 2px solid #225DBB;
                padding: 12px 50px;
            }
        
            button:hover {
                background-color: transparent !important;
                color: black;
                transition: all 0.3s ease-in-out;
            }
        
            button:active {
                transform: scale(0.95);
                transition: all 0.3s ease-in-out;
            }
        
            @media screen and (max-width: 500px) {
                section {
                    padding: 0;
                }
        
                .wrapper {
                    width: 100%;
                }
            }
        </style>
        `
        // > Regex to match {{link}} in the email template and replace it with the otp link
        const newEmailTemplate = emailTemplate.replace(/{{link}}/g, `${process.env.CLIENT_URL?.split(',')[0]}/verify/${otp}`)
        
        // > Send the email
        await sendEmail(user.email.toString(), 'Verify Your Account', newEmailTemplate)
        return res.status(200).send({
            msg: 'OTP_SENT_SUCCESSFULLY'
        })
    } catch (err) {
        return res.status(400).send(err)
    }
}

const verifyOTP = async (req: Request, res: Response) => {
    try {
        // > Check if the user is already logged in
        if (!req.isAuthenticated()) return res.status(400).send({
            msg: "USER_NOT_LOGGED_IN"
        })

        // > Check if the user is already verified
        if (req.user.verified) return res.status(400).send({
            msg: "USER_ALREADY_VERIFIED"
        })

        // > Get the OTP from redis
        const otp = await RedisClient.v4.get(req.user.id)

        // > Check if the OTP is correct
        if (otp !== req.body.otp) return res.status(400).send({
            msg: "INVALID_OTP"
        })

        // > Find the user in the database and send an error if not found
        const user = await userModel.findById(req.user.id)
        if (!user) return res.status(400).send({
            msg: 'USER_DOES_NOT_EXIST'
        })

        // > Update the user's verified field to true
        user.verified = true
        await user.save()

        // > Update the user's session and save it
        req.user.verified = true
        req.session.save()

        // > Delete the OTP from redis
        await RedisClient.v4.del(req.user.id)

        // > Send the response
        return res.status(200).send({
            msg: 'OTP_VERIFIED_SUCCESSFULLY'
        })
    } catch (err) {
        return res.status(400).send(err)
    }
}

const logout = async (req: Request, res: Response) => {
    try {
        // > Check if the user is logged in
        if (!req.isAuthenticated()) return res.status(400).send({
            msg: "USER_NOT_LOGGED_IN"
        })        
        // > Logout the user
        req.session.destroy((err) => {
            if (err) return res.status(400).send(err)
            return res.status(200).send({
                msg: "LOGGED_OUT_SUCCESSFULLY"
            })
        })
        // > Send the response
        return res.status(200).send({
            msg: "LOGGED_OUT_SUCCESSFULLY"
        })
    } catch (err) {
        return res.status(400).send(err)
    }
}
const me = async (req: Request, res: Response) => {
    try {
        // > Check if the user is already logged in
        if (!req.isAuthenticated()) return res.status(400).send({
            msg: "USER_NOT_LOGGED_IN"
        })

        // > Send the response
        return res.status(200).send({
            msg: 'USER_FOUND_SUCCESSFULLY',
            data: req.user
        })
    } catch (err) {
        return res.status(400).send(err)
    }
}

const createForgotPasswordOTP = async (req: Request, res: Response) => {
    try {
        //Check if the email exists and if it does, create a link and send it to the user in an email
        const user = await userModel.findOne({
            email: req.body.email
        })
        if (!user) return res.status(400).send({
            msg: 'USER_NOT_FOUND'
        })
        // Create a link and send it to the user in an email. Link is valid for 10 minutes and is in the form CLIENT_URL/forgotpassword/123124-aadqqw-125125
        const otp = await generateOTP()
        await RedisClient.v4.set(otp, req.body.email)
        await RedisClient.v4.expire(otp, 600)

        const emailTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
            <link rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        </head>
        
        <body>
            <section>
                <div class="wrapper">
                    <div class="content">
                        <h1>Reset your password</h1>
                        <p>Click the link below for resetting for password</p>
                        <a href="{{link}}" class="btn">
                            <button>Reset Password</button>
                        </a>
                    </div>
                </div>
            </section>
        </body>
        
        </html>
        
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Arial', sans-serif;
            }
        
            section {
                width: 100%;
                height: 100vh;
                display: flex;
                justify-content: center;
                background-color: #FAFAFA;
            }
        
            .wrapper {
                width: 100%;
                height: fit-content;
                background-color: #FFFFFF;
                margin-top: 30px;
                max-width: 450px;
                max-height: 560px;
            }
        
            .image {
                width: 100%;
                height: 100%;
                padding: 30px 0;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #F4EEE2;
            }
        
            .image img {
                width: 130px;
                height: 100%;
                object-fit: contain;
            }
        
            .content {
                padding: 40px;
                text-align: center;
            }
        
            .content p {
                margin: 30px 0;
                line-height: 25px;
                opacity: 0.6;
            }
        
            button {
                color: #ffffff;
                font-size: 14px;
                padding: 12px 0;
                border-radius: 7px;
                border: none;
                cursor: pointer;
                transition: all 0.3s ease-in-out;
                font-weight: 600;
                background-color: #225DBB;
                border: 2px solid #225DBB;
                padding: 12px 50px;
            }
        
            button:hover {
                background-color: transparent !important;
                color: black;
                transition: all 0.3s ease-in-out;
            }
        
            button:active {
                transform: scale(0.95);
                transition: all 0.3s ease-in-out;
            }
        
            @media screen and (max-width: 500px) {
                section {
                    padding: 0;
                }
        
                .wrapper {
                    width: 100%;
                }
            }
        </style>
        `
        const link = `${process.env.CLIENT_URL?.split(',')[0]}/forgotpassword/${otp}`
        const newEmailTemplate = emailTemplate.replace(/{{link}}/g, `${process.env.CLIENT_URL?.split(',')[0]}/forgotpassword/${otp}`)
        await sendEmail(user.email.toString(), 'Forgot Password', newEmailTemplate)
        return res.status(200).send({
            msg: 'OTP_SENT_SUCCESSFULLY'
        })
    }catch(err){
        return res.status(400).send(err)
    }
}

const canResetPassword = async (req: Request, res: Response) => {
    try {
        const otp = req.body.otp
        const email = await RedisClient.v4.get(otp)
        if (!email) return res.status(400).send({
            msg: 'OTP_INVALID'
        })
        return res.status(200).send({
            msg: 'OTP_VALID'
        })
    }catch(err){
        return res.status(400).send(err)
    }
}

const verifyForgotPasswordOTP = async (req: Request, res: Response) => {
    try {
        // > Check if the otp exists in the redis cache and if it does, send the user to the reset password page
        const email = await RedisClient.v4.get(req.body.id)
        if(!email) return res.status(400).send({
            msg: 'OTP_DOES_NOT_EXIST'
        })
        const user = await userModel.findOne({
            email
        })
        if(!user) return res.status(400).send({
            msg: 'USER_DOES_NOT_EXIST'
        })
        user.password = await bcrypt.hash(req.body.password, 10)
        await user.save()
        await RedisClient.v4.del(req.body.id)
        return res.status(200).send({
            msg: 'PASSWORD_CHANGED_SUCCESSFULLY'
        })
    }catch(err){
        return res.status(400).send(err)
    }
}

export {
    register,
    login,
    sendOTP,
    verifyOTP,
    canRegister,
    me,
    logout,
    createForgotPasswordOTP,
    verifyForgotPasswordOTP,
    canResetPassword
}
