import { Request, Response } from "express";
import userModel from "../models/user.model";
import contactsModel from "../models/contacts.model";
import { DateTime } from 'luxon';

const addContact = async (req: Request, res: Response) => {
    const { fullName, contact_frequency, notes, dob } = req.body;
    try {
        // > Check if the contact already exists
        const user = await userModel.findById(req.user!.id)
        if (!user) return res.status(400).send({ msg: "USER_NOT_FOUND" })
        let date

        // > If the contact frequency is not null, then set the contact date to the current date plus the contact frequency
        if (contact_frequency) {
            date = new Date(DateTime.now().setZone(user.timezone.replace(' ', '_')).plus({ days: contact_frequency }).toISODate())
        }

        // > Create the contact
        const newContact = new contactsModel({
            fullName,
            contact_frequency,
            notes,
            dob,
            contact_date: contact_frequency === 0 || contact_frequency === undefined || contact_frequency === null ? null : date,
        });
        const saved = await newContact.save();

        // > Add the contact to the user's contacts
        user.contacts.push(saved._id)
        await user.save()
        return res.status(201).send({
            msg: "CONTACT_CREATED_SUCCESSFULLY",
            data: saved,
        });
    } catch (err) {
        return res.status(400).send(err);
    }
}

const getContacts = async (req: Request, res: Response) => {
    try {
        // > Get the user's contacts
        const user = await userModel.findById(req.user!.id).populate('contacts')
        if (!user) return res.status(400).send({ msg: "USER_NOT_FOUND" })
        //Loop through the contacts and get details for all of them in an array
        const promises = user.contacts.map(async (contact: any) => {
            const contactData = await contactsModel.findById(contact._id)
            if (contactData) return contactData
        }
        )

        //Wait for all the promises to resolve
        const contacts = await Promise.all(promises)
        return res.status(200).send(contacts.filter((contact: any) => contact !== undefined))
    } catch (err) {
        return res.status(400).send(err);
    }

}

const updateContact = async (req: Request, res: Response) => {
    let { fullName, contact_frequency, notes, dob } = req.body;
    try {
        // > Check if the contact exists
        const contact = await contactsModel.findById(req.params.id)
        if (!contact) return res.status(400).send({ msg: "CONTACT_NOT_FOUND" })
        contact.fullName = fullName
        contact.notes = notes

        // > If the dob is null or undefined, then set it to null else set it to the new dob
        if(!dob){
            contact.dob = null
            console.log(contact)
        } else contact.dob = dob

        // > If the contact frequency is null or undefined, then set it to null else set it to the new contact frequency
        if (!contact_frequency){
            contact.contact_frequency = null
            contact.contact_date = null
        }

        // > If the contact frequency is not null and the contact frequency is not the same as the old contact frequency
        if (contact_frequency && contact_frequency !== contact.contact_frequency) {
            const user = await userModel.findById(req.user!.id)
            if (!user) return res.status(400).send({ msg: "USER_NOT_FOUND" })
            // > Difference between the current date and the contact date. The current date can also be null 
            const difference = contact.contact_date ? DateTime.fromISO(contact.contact_date.toISOString()).diffNow().as('days') : 0
            // > If the difference is negative, then the contact date has passed and the contact date should be set to the current date plus the contact frequency
            if (difference < 0) {
                contact.contact_date = new Date(DateTime.now().setZone(user.timezone.replace(' ', '_')).plus({ days: contact_frequency }).toISODate())
            } else {
                //If the difference is positive, then the contact date has not passed and the contact date should be set to the current date plus the difference between the contact frequency and the current date
                contact.contact_date = new Date(DateTime.now().setZone(user.timezone.replace(' ', '_')).plus({ days: contact_frequency - difference }).toISODate())
            }
            contact.contact_frequency = contact_frequency
        }
        const result = await contact.save()
        console.log(result)
        return res.status(200).send({
            msg: "CONTACT_UPDATED_SUCCESSFULLY",
            data: contact,
        });
    } catch (err) {
        return res.status(400).send(err);
    }
}

const deleteContact = async (req: Request, res: Response) => {
    try {
        // > Check if the contact exists
        const contact = await contactsModel.findById(req.params.id)
        if (!contact) return res.status(400).send({ msg: "CONTACT_NOT_FOUND" })
        
        // > Delete the contact
        await contact.remove()
        const user = await userModel.findById(req.user!.id)
        if (!user) return res.status(400).send({ msg: "USER_NOT_FOUND" })

        // > Remove the contact from the user's contacts
        user.contacts = user.contacts.filter((contact: any) => contact._id.toString() !== req.params.id)

        // > Save the user
        await user.save()
        return res.status(200).send({
            msg: "CONTACT_DELETED_SUCCESSFULLY",
        });
    } catch (err) {
        return res.status(400).send(err);
    }
}



export {
    addContact,
    getContacts,
    updateContact,
    deleteContact,
}