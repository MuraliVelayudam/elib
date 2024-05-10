import express from 'express'
import { createUser, userLogin } from './../userController/userController'

const userRouter = express.Router()

userRouter.post('/register', createUser)
userRouter.post('/login', userLogin)

export default userRouter
