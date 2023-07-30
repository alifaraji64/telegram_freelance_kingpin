import { bot } from '../../index.js'

export const Welcome = () => {
  bot.onText(/\/start/, msg => {
    const chatId = msg.chat.id
    bot.sendMessage(
      chatId,
      `welcome to kingpinGig where you can start hiring developers, designers and engineers for your dream project
      \n choose which one you want to countine as`,
      {
        reply_markup: {
          keyboard: [
            [
              'I wanna hire people for my project',
              'I wanna work as a freelancer'
            ]
          ]
        }
      }
    )
  })

  bot.on('callback_query', async(callback_message) => {

  })
}

