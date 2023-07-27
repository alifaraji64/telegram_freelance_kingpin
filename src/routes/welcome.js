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
    console.log('callback query');
    const title = callback_message.data.split('/')[0] //job
    if (title == 'job') {
      const job = callback_message.data.split('/')[1] //dapp
      await bot.sendPhoto(
        callback_message.from.id,
        'https://raw.githubusercontent.com/hosein2398/node-telegram-bot-api-tutorial/master/pics/CaptionJPG.JPG',
        { caption: 'Here we go ! \nThis is just a caption'},
      )
      console.log(callback_message)
    }
  })
}

