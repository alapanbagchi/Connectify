import { IContact } from 'src/models/contacts.model'
import * as yup from 'yup'

const addContactValidation = async (data: any) => {
    try {
        if(!data.dob && !data.contact_frequency) return {message: 'Either dob or contact_frequency is required'}
        const schema = yup.object({
            fullName: yup.string().required('Name is required'),
            dob: yup.string(),
            contact_frequency: yup.string(),
            notes: yup.string(),
        })
        const res: any = await schema.validate(data, { abortEarly: true })
        return undefined
    } catch (err: any) {
        return err
    }
}

const updateContactValidation = async (data: any) => {
    try {
        if(!data.dob && !data.contact_frequency) return {message: 'Either dob or contact_frequency is required'}
        const schema = yup.object({
            fullName: yup.string(),
            contact_frequency: yup.string(),
            notes: yup.string(),
            dob: yup.string(),
        })
        const res: any = await schema.validate(data, { abortEarly: true })
        return undefined
    } catch (err: any) {
        return err
    }
}



export {
    updateContactValidation,
    addContactValidation
}