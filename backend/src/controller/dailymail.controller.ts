import { Request, Response } from 'express';
import { sendEmail } from '../utils/nodemailer';
import contactsModel from '../models/contacts.model';
import userModel, { IUser } from '../models/user.model';
import { DateTime } from 'luxon';

const dailyMailData = async (user: IUser): Promise<string> => {
    try {
        const today = new Date(DateTime.now().setZone(user.timezone.replace(' ', '_')).toISODate())
        // > Get all the contacts of the user
        const contacts = user.contacts
        // > Fetch all contacts
        const contactsData = await contactsModel.find({ _id: { $in: contacts } })
        // > Create a string to store the data. Check if the contact_date in the contact is today or not. If yes, then add the contact to the string in the form of name(email)
        const todaysContacts: any[] = []
        const contact_data: string[] = []
        const birthday_data: string[] = []
        const todo: string[] = []
        contactsData.forEach(contact => {

            // > Check if the contact_date in the contact is today or not. If yes, then add the contact to the string in the form of name(notes)
            if (contact.contact_date) {
                const contact_date = new Date(DateTime.fromJSDate(contact.contact_date).toISODate())
                if (contact_date <= today) {
                    todaysContacts.push(contact)
                    contact_data.push(`${contact.fullName} ${contact.notes === "" ? "" : `(${contact.notes})`}`)
                }
            }

            // > Check if the contact's birthday is today or not. If yes, then add the contact to the string in the form of name(notes)
            if (contact.dob != null || contact.dob != undefined) {
                if (contact.dob.getDate() === today.getDate() && contact.dob.getMonth() === today.getMonth()) {
                    // Find the age of the contact
                    const age = today.getFullYear() - contact.dob.getFullYear()
                    birthday_data.push(`${contact.fullName} (${age})`)
                }
            }
        })

        // > Get todo list of the user for the particular date
        user.todo.forEach((list) => {
            // > Check if the todo_date in the todo is today or not. If yes, then add the todo to the string 
            const todoDate = new Date(DateTime.fromJSDate(list.date).toISODate())
            if (todoDate.getDate() === today.getDate() && todoDate.getMonth() === today.getMonth() && todoDate.getFullYear() === today.getFullYear()) {
                list.task.forEach(task => {
                    todo.push(task)
                })
            }
        })

        // > Get the age of the user in Years Months and Days
        const date2 = DateTime.fromJSDate(user.dob)
        const date1 = DateTime.fromJSDate(today)
        const diff = date1.diff(date2, ["years", "months", "days"])
        const birthday = `Today you are ${diff.years} years, ${diff.months} months and ${diff.days} days old and one day you are going to die. What would you do if today was your last day?`
        // > Create a variable called contact text that contains the a string with all the contacts within li
        let contact_text = ''
        if (contact_data.length) {
            contact_data.forEach(function (contact) {
                contact_text = contact_text.concat(`<li>${contact}</li>`)
            })
        } else {
            contact_text = ''
        }

        let birthday_text = ''
        if (birthday_data.length) {
            birthday_data.forEach(function (bday) {
                birthday_text = birthday_text.concat(`<li>${bday}</li>`)
            })
        } else {
            birthday_text = ''
        }

        let task_text = ''
        todo.forEach((t) => {
            task_text = task_text.concat(`<li>${t}</li>`)
        })
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Daily Mail</title>
            <style>
                *{
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-size: 16px;
                    font-family: 'Inter', sans-serif;
                    color: black;
                }
            </style>
        </head>
        <body>
            <p>Good Morning ${user.fullName.split(' ')[0]},</p>
            <br />
            <p>${birthday}</p>
            ${contact_text != '' ? '<br /> <p>You should contact these people today: <br />' + contact_text + '</p>' : ''}
            ${birthday_text != '' ? '<br /> <p>Dont forget to wish a happy birthday to: <br />' + birthday_text + '</p>' : ''}
            ${todo.length > 0 ? '<br /> <p>I also want to remind you to: <br />' + task_text + '</p>' : ''}
            <br />
            <p>Have a great day ahead!</p>
        </body>
        </html>`

        await sendEmail(user.email, 'Daily Mail', html)
        //Update the contact_date of the contacts by adding the contact_frequuency amount of days to the contact_date
        const contactUpdatePromises: any = []
        todaysContacts.forEach(async (contact) => {
            if (contact.contact_frequency != null || contact.contact_frequency != undefined || contact.contact_frequency != 0) {
                contact.contact_date = new Date(contact.contact_date.getTime() + (contact.contact_frequency * 24 * 60 * 60 * 1000))
                const dateUpdate = await contact.save()
                contactUpdatePromises.push(dateUpdate)
            }
        })
        // //Delete the todo list of the user for the particular date
        user.todo.forEach((list) => {
            const listDate = new Date(DateTime.fromJSDate(list.date).toISODate())
            if (listDate <= today) {
                user.todo.splice(user.todo.indexOf(list), 1)
            }
        })
        // //Update last mail sent date
        user.last_daily_mail = today

        await user.save()
        await Promise.all(contactUpdatePromises)
        return 'SUCCESS'
    } catch (err) {
        return 'ERROR'
    }
}


// > This route is called using a cron job every 30 mins. Every 30 mins its 6am somewhere in the world. So, this route will send the daily mail to all the users in the database for whom the time is 6am according to the timezone
const dailyMail = async (req: Request, res: Response) => {
    try {
        const users = await userModel.find({ verified: true })
        let promise = []
        for (let user of users) {
            const today = DateTime.now().setZone(user.timezone.replace(' ', '_'))
            const lastMail = DateTime.fromJSDate(user.last_daily_mail)
            if ((lastMail.day === today.day && lastMail.month === today.month && lastMail.year === today.year) || today.hour < 6) {
                continue        
            }
            console.log("Sending mail to: ", user.email)
            const data = await dailyMailData(user)
            promise.push(data)
        }

        // > Wait for all the promises to resolve
        await Promise.all(promise)

        res.status(200).send({ msg: 'Mail Sent' })
    } catch (err) {
        console.log(err)
    }
}

export {
    dailyMail
}