import express from 'express'
import { addContactValidation, updateContactValidation } from '../validation/contact.validation'
import { authGuard } from '../utils/authGuard'
import { addContact, deleteContact, getContacts, updateContact } from '../controller/contact.controller'
import { sendEmail } from 'src/utils/nodemailer'
const router = express.Router()

router.post('/add', authGuard, async (req, res) => {
    const err = await addContactValidation(req.body)
    if (err) return res.status(400).send(err.message)
    addContact(req, res)
})

router.get('/get', authGuard, getContacts)

router.patch('/update/:id', authGuard, async (req, res) => {
    // const err = await updateContactValidation(req.body)
    // if (err) return res.status(400).send(err.message)
    updateContact(req, res)
})

router.delete('/delete/:id', authGuard, deleteContact)

module.exports = router