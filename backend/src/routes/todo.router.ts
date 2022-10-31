import { addTodo, deleteTodo, getTodo, updateTodo } from '../controller/todo.controller';
import express from 'express'
import { authGuard } from '../utils/authGuard'
import { addTodoValidation } from '../validation/todo.validation'
const router = express.Router()

router.post('/add', authGuard, async (req, res) => {
    const err = await addTodoValidation(req.body)
    if (err) return res.status(400).send(err.message)
    addTodo(req, res)
})

router.get('/get', authGuard, (req, res) => {
    getTodo(req, res)
})

router.patch('/update', authGuard, (req, res) => {
    updateTodo(req, res)
})

router.delete('/delete', authGuard, (req, res) => {
    deleteTodo(req, res)
})

module.exports = router