import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { talents } from './src/globals.js'
import TelegramBot from 'node-telegram-bot-api'
import { Welcome } from './src/routes/welcome.js'
import { Customer } from './src/routes/customer.js'
import { Talent } from './src/models/Talent.js'
dotenv.config()
export const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true })
const DB =
  `mongodb+srv://crypto_kingpin:${process.env.MONGO_PASSWORD}@cluster0.ix2llne.mongodb.net/?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)

mongoose
  .connect(DB)
  .then(() => {
    console.log('connected')
    bot.on('polling_error', console.log)
    //talents[3].save().then(()=>console.log('saved'))
    Welcome()
    Customer()
  })
  .catch(error => console.log(error))

