import { timezones } from '../utils/timezones'
import * as yup from 'yup'

const registerDataValidation = async (data: any) => {
    try {
        const schema = yup.object({
            fullName: yup
                .string()
                .required('Fullname is required'),
            email: yup
                .string()
                .email('Email is invalid')
                .required('Email is required'),
            dob: yup
            .string()
            .required('Date is required')
            .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date is invalid'),
            timezone: yup
                .string()
                .required('Timezone is required')
                .oneOf(timezones, 'Timezone is invalid')
                ,
            password: yup
                .string()
                .required('Password is required')
                .min(10, 'Password must be at least 10 characters')
                .max(50, 'Password must be at most 50 characters')
                .matches(/(?=.*[A-Z])/, 'Password must contain one uppercase letter')
                .matches(/(?=.*[a-z])/, 'Password must contain one lowercase letter')
                .matches(/(?=.*[0-9])/, 'Password must contain one number')
                .matches(/(?=.*[!@#$%_^&*])/, 'Password must contain one special character'),
            confirmPassword: yup
                .string()
                .required('Confirm password is required')
                .oneOf([yup.ref('password'), null], 'Passwords must match')
        })
        const res: any = await schema.validate(data, { abortEarly: true })
        return undefined
    } catch (err: any) {
        return err
    }
}
const canRegisterValidation = async (data: any) => {
    try {
        const schema = yup.object({
            email: yup
                .string()
                .email('Email is invalid')
                .required('Email is required'),
        })
        const res: any = await schema.validate(data, { abortEarly: true })
        return undefined
    } catch (err: any) {
        return err
    }
}

const loginDataValidation = async (data: any) => {
    try {
        const schema = yup.object({
            email: yup
                .string()
                .email('Email is invalid')
                .required('Email is required'),
            password: yup
                .string()
                .required('Password is required')
        })
        const res: any = await schema.validate(data, { abortEarly: true })
        return undefined
    } catch (err: any) {
        return err
    }
}

const verifyDataValidation = async (data: any) => {
    try {
        const schema = yup.object({
            code: yup
                .string()
                .required('Code is required')
        })
        const res: any = await schema.validate(data, { abortEarly: true })
        return undefined
    } catch (err: any) {
        return err
    }
}

const forgotPasswordDataValidation = async (data: any) => {
    try {
        const schema = yup.object({
            email: yup
                .string()
                .email('Email is invalid')
                .required('Email is required'),
        })
        const res: any = await schema.validate(data, { abortEarly: true })
        return undefined
    } catch (err: any) {
        return err
    }
}

const resetPasswordDataValidation = async (data: any) => {
    try {
        const schema = yup.object({
            password: yup
                .string()   
                .required('Password is required')
                .min(10, 'Password must be at least 10 characters')
                .max(50, 'Password must be at most 50 characters')
                .matches(/(?=.*[A-Z])/, 'Password must contain one uppercase letter')
                .matches(/(?=.*[a-z])/, 'Password must contain one lowercase letter')
                .matches(/(?=.*[0-9])/, 'Password must contain one number')
                .matches(/(?=.*[!@#$%_^&*])/, 'Password must contain one special character'),
            confirmPassword: yup
                .string()
                .required('Confirm password is required')
                .oneOf([yup.ref('password'), null], 'Passwords must match')
        })
        const res: any = await schema.validate(data, { abortEarly: true })
        return undefined
    } catch (err: any) {
        return err
    }
}

export {
    registerDataValidation,
    loginDataValidation,
    verifyDataValidation,
    canRegisterValidation
}