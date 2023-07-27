import dotenv from 'dotenv'
dotenv.config()
import TelegramBot from 'node-telegram-bot-api'
import welcomeF from './src/routes/welcome.js'

export const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true })
bot.on('polling_error', console.log)
welcomeF()




// Start listening for incoming messages and commands

