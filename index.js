import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { talents } from './src/globals.js'
import TelegramBot from 'node-telegram-bot-api'
import { Welcome } from './src/routes/welcome.js'
import { Customer } from './src/routes/customer.js'
import { Talent } from './src/models/Talent.js'
import { Freelancer } from './src/routes/freelancer.js'
import { menuHandle } from './src/routes/globals/menu_handle.js'
import { gigOperations } from './src/routes/freelancer/gig_operations.js'
import { createClient } from '@supabase/supabase-js'
import { Web3Storage } from 'web3.storage'
dotenv.config()
export const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true })
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  { auth: { persistSession: false } }
)
export const web3Storage = new Web3Storage({ token: process.env.WEB3_STORAGE_TOKEN })
const DB = `mongodb+srv://crypto_kingpin:${process.env.MONGO_PASSWORD}@cluster0.ix2llne.mongodb.net/?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)

mongoose
  .connect(DB)
  .then(() => {
    console.log('connected')
    bot.on('polling_error', console.log)
    //talents[3].save().then(()=>console.log('saved')).catch(console.log)
    Welcome()
    Customer()
    Freelancer()
    menuHandle()
    gigOperations()
  })
  .catch(error => console.log(error))
