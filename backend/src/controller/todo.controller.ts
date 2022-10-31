import { sendEmail } from '../utils/nodemailer';
import { Request, Response } from "express";
import userModel from "../models/user.model";
import contactsModel from "../models/contacts.model";
import { DateTime } from 'luxon';

const addTodo = async (req: Request, res: Response) => {
    const { todo, date } = req.body;
    try {
        // > Find the user from the database
        const user = await userModel.findById(req.user!.id)
        if (!user) return res.status(400).send({ msg: "USER_NOT_FOUND" })

        // > Get todays date according to the user's timezone and set the time to 00:00:00
        const today = new Date(DateTime.now().setZone(user.timezone.replace(' ', '_')).toISODate())

        // > This is the date that the user wants to add the todo
        const listDate = new Date(DateTime.fromISO(date).setZone(user.timezone.replace(' ', '_')).toISODate())

        // > If the date is before today's date then return an error
        if (listDate < today) return res.status(400).send({ msg: "PAST_DATE" })

        // > Check if the user already has a todo list for the date add this todo to that list
        const todoObj = user.todo.find((todo: any) => new Date(todo.date).toLocaleDateString() === new Date(date).toLocaleDateString())

        // > If the user already has a todo list for the date add this todo to that list
        if (todoObj) {
            todoObj.task.push(todo)
        } else {
            user.todo.push({ date, task: [todo] })
        }

        // > Save the user to the database
        await user.save()
        return res.status(201).send({
            msg: "TODO_CREATED_SUCCESSFULLY",
            data: user.todo,
        });

    } catch (err) {
        return res.status(400).send(err);
    }
}

const getTodo = async (req: Request, res: Response) => {
    try {
        // > Find the user from the database
        const user = await userModel.findById(req.user!.id)
        if (!user) return res.status(400).send({ msg: "USER_NOT_FOUND" })
        return res.status(200).send(user.todo)
    } catch (err) {
        return res.status(400).send(err);
    }
}

const updateTodo = async (req: Request, res: Response) => {
    const { date, index, newTodo, newDate } = req.body;
    try {
        // > Find the user from the database
        const user = await userModel.findById(req.user!.id)
        if (!user) return res.status(400).send({ msg: "USER_NOT_FOUND" })
        
        // > Get todays date according to the user's timezone and set the time to 00:00:00
        const today = DateTime.now().setZone(user.timezone.replace(' ', '_')).set({hour: 0, minute: 0, second: 0, millisecond: 0}).toJSDate()

        // > Get the date that the user wants to update the todo
        const listDate = DateTime.fromISO(newDate).setZone(user.timezone.replace(' ', '_')).set({hour: 0, minute: 0, second: 0, millisecond: 0}).toJSDate()

        // > If the date is before today's date then return an error
        if ( listDate < today ) return res.status(400).send({ msg: "PAST_DATE" })

        // > Find the todo object from the user's todo array
        const todoObj = user.todo.find((todo: any) => new Date(todo.date).toLocaleDateString() === new Date(date).toLocaleDateString())
        if (!todoObj) return res.status(400).send({ msg: "TODO_NOT_FOUND" })

        // > Update the todo
        todoObj.task[index] = newTodo

        // > If the user wants to update the date of the todo
        if (new Date(date).toLocaleDateString() !== new Date(newDate).toLocaleDateString()) {
            // > Remove the todo from the old date
            const newTodoObj = user.todo.find((todo: any) => new Date(todo.date).toLocaleDateString() === new Date(newDate).toLocaleDateString())

            // > If the user already has a todo list for the date add this todo to that list
            if (newTodoObj) {
                newTodoObj.task.push(newTodo)
            } else {
                user.todo.push({ date: newDate, task: [newTodo] })
            }

            // > Remove the todo from the old date
            todoObj.task.splice(index, 1)

            // If the todo array is empty remove the object from todo array
            if (todoObj.task.length === 0) {
                user.todo = user.todo.filter((todo: any) => new Date(todo.date).toLocaleDateString() !== new Date(date).toLocaleDateString())
            }
        }
        await user.save()
        return res.status(200).send({
            msg: "TODO_UPDATED_SUCCESSFULLY",
            data: user.todo,
        });
    } catch (err) {
        return res.status(400).send(err);
    }

}

const deleteTodo = async (req: Request, res: Response) => {
    const { date, index } = req.body;
    console.log("BODY: ", date, index)
    try {
        // > Find the user from the database
        const user = await userModel.findById(req.user!.id)
        if (!user) return res.status(400).send({ msg: "USER_NOT_FOUND" })

        // > Find the todo object from the user's todo array
        const todoObj = user.todo.find((todo: any) => new Date(todo.date).toLocaleDateString() === new Date(date).toLocaleDateString())

        // > If the todo object is not found return an error
        if (!todoObj) return res.status(400).send({ msg: "TODO_NOT_FOUND" })
        todoObj.task.splice(index, 1)

        // > If the todo array is empty remove the object from todo array
        if (todoObj.task.length === 0) {
            user.todo = user.todo.filter((todo: any) => new Date(todo.date).toLocaleDateString() !== new Date(date).toLocaleDateString())
        }
        await user.save()
        return res.status(200).send({
            msg: "TODO_DELETED_SUCCESSFULLY",
            data: user.todo,
        });
    }
    catch (err) {
        return res.status(400).send(err);
    }
}


export {
    addTodo,
    getTodo,
    updateTodo,
    deleteTodo
}