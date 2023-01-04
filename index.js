import dotenv from "dotenv";
dotenv.config({ silent: process.env.NODE_ENV === 'production' });

import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import mongoose from 'mongoose'
import {validationResult }from 'express-validator'

import {registerValidation} from './validations/auth.js'

import UserModel from './models/User.js'

mongoose.connect(`${process.env.REACT_APP_API_KEY}`)
    .then(() => console.log('DB ok'))
    .catch((error) => console.log('DB error', error)
    )

const app = express()
app.use(express.json())


app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json(errors.array())
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password,salt)

        const doc = new UserModel({
            email: req.body.email,
            fullName:req.body.fullName,
            avatarUrl:req.body.avatarUrl,
            passwordHash,
        })

        const user = await doc.save()

        res.json({
            success:true
        })
    } catch (err){
        console.log(err)
        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        })
    }
})

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('Server ok')
})