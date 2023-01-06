import dotenv from "dotenv";
dotenv.config({ silent: process.env.NODE_ENV === 'production' });

import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import mongoose from 'mongoose'
import {validationResult }from 'express-validator'

import {registerValidation} from './validations/auth.js'



import UserModel from './models/User.js'
import checkAuth from './utils/checkAuth.js'
import User from "./models/User.js";
import * as UserController from "./controllers/UserController.js";


mongoose.connect(`${process.env.REACT_APP_API_KEY}`)
    .then(() => console.log('DB ok'))
    .catch((error) => console.log('DB error', error)
    )

const app = express()
app.use(express.json())


app.post('/auth/login',   UserController.login)

app.post('/auth/register', registerValidation,  UserController.register)

app.get('/auth/me', checkAuth, UserController.getMe)

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('Server ok')
})