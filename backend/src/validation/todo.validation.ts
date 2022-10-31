import { IContact } from 'src/models/contacts.model'
import * as yup from 'yup'

const addTodoValidation = async (data: any) => {
    try {
        const schema = yup.object({
            todo: yup.string().required('Todo is required'),
            date: yup.string().required('Date is required'),
        })
        const res: any = await schema.validate(data, { abortEarly: true })
        return undefined
    } catch (err: any) {
        return err
    }
}



export {
    addTodoValidation
}