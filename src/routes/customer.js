import { bot } from "../../index.js"
import { jobs } from "../globals.js"
export const Customer = () => {
  bot.onText(/I wanna hire people for my project/, msg => {
    const chatId = msg.chat.id
    console.log('I wanna hire people')
    bot.sendMessage(chatId, 'select the type of your project', {
      reply_markup: {
        inline_keyboard: jobs
      }
    })
  })

  bot.on('callback_query', async(callback_message) => {
    const title = callback_message.data.split('/')[0] //job
    if (title == 'job') {
      const job = callback_message.data.split('/')[1] //dapp
      await bot.sendMessage(
        callback_message.from.id,
        'wohooololololo'
      )
      console.log(callback_message)
    }
  })
}

